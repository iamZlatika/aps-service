import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { type OrderDto } from "@/features/orders/api/dto";
import {
  mapCallHistoryDtoToCallHistoryItem,
  mapDocumentDtoToOrderDocument,
  mapOrderCommentDtoToOrderComment,
  mapOrderDtoToOrder,
  mapOrderProductDtoToOrderProduct,
  mapOrderServiceDtoToOrderService,
  mapPaymentDtoToPayment,
  mapStatusHistoryItemDtoToStatusHistoryItem,
} from "@/features/orders/lib/adapters";
import { applyItemAction } from "@/features/orders/lib/services";
import {
  type OrderCalledChangedSocketEvent,
  type OrderCommentSocketEvent,
  type OrderDocumentSocketEvent,
  type OrderInfo,
  type OrderPaymentSocketEvent,
  type OrderProductSocketEvent,
  type OrderServiceSocketEvent,
  type OrderSocketEvent,
  type OrderStatusChangedSocketEvent,
} from "@/features/orders/types";
import { queryKeys } from "@/shared/api/queryKeys";
import { getEcho } from "@/shared/lib/echo";

const ORDER_UPDATE_EVENTS = [
  ".order.updated",
  ".order.urgency_changed",
  ".order.sms_sent",
] as const;

const mergeOrderFields = (old: OrderInfo, orderDto: OrderDto): OrderInfo => {
  const { customer: _customer, ...orderFields } = mapOrderDtoToOrder(orderDto);
  return { ...old, ...orderFields };
};

export const useOrderSocket = (orderId: number): void => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channelName = `backoffice.orders.${orderId}`;
    const channel = echo.private(channelName);

    const updateCache = (updater: (old: OrderInfo) => OrderInfo): void => {
      queryClient.setQueryData<OrderInfo>(
        queryKeys.orders.detail(orderId),
        (old) => (old ? updater(old) : old),
      );
    };

    const handleOrderUpdated = (e: OrderSocketEvent): void => {
      updateCache((old) => mergeOrderFields(old, e.data.order));
    };

    const handleStatusChanged = (e: OrderStatusChangedSocketEvent): void => {
      const item = mapStatusHistoryItemDtoToStatusHistoryItem(
        e.data.status_history_item,
      );
      updateCache((old) => {
        if (old.statusHistory.some((i) => i.id === item.id)) return old;
        return {
          ...mergeOrderFields(old, e.data.order),
          statusHistory: [...old.statusHistory, item],
        };
      });
    };

    const handleCalledChanged = (e: OrderCalledChangedSocketEvent): void => {
      const item = mapCallHistoryDtoToCallHistoryItem(e.data.call_history_item);
      updateCache((old) => {
        if (old.callHistory.some((i) => i.id === item.id)) return old;
        return {
          ...mergeOrderFields(old, e.data.order),
          callHistory: [...old.callHistory, item],
        };
      });
    };

    const handleCommentAdded = (e: OrderCommentSocketEvent): void => {
      const comment = mapOrderCommentDtoToOrderComment(e.data.comment);
      updateCache((old) => {
        if (old.comments.some((i) => i.id === comment.id)) return old;
        return { ...old, comments: [...old.comments, comment] };
      });
    };

    const handleDocumentAdded = (e: OrderDocumentSocketEvent): void => {
      const orderDocument = mapDocumentDtoToOrderDocument(e.data.document);
      updateCache((old) => {
        const idx = old.documents.findIndex(
          (d) => d.type === orderDocument.type,
        );
        if (idx === -1)
          return { ...old, documents: [...old.documents, orderDocument] };
        const documents = [...old.documents];
        documents[idx] = orderDocument;
        return { ...old, documents };
      });
    };

    const handlePaymentChanged = (e: OrderPaymentSocketEvent): void => {
      const payment = mapPaymentDtoToPayment(e.data.payment);
      updateCache((old) => ({
        ...mergeOrderFields(old, e.data.order),
        payments: applyItemAction(old.payments, payment, e.data.action),
      }));
    };

    const handleServiceChanged = (e: OrderServiceSocketEvent): void => {
      const service = mapOrderServiceDtoToOrderService(e.data.service);
      updateCache((old) => ({
        ...mergeOrderFields(old, e.data.order),
        services: applyItemAction(old.services, service, e.data.action),
      }));
    };

    const handleProductChanged = (e: OrderProductSocketEvent): void => {
      const product = mapOrderProductDtoToOrderProduct(e.data.product);
      updateCache((old) => ({
        ...mergeOrderFields(old, e.data.order),
        products: applyItemAction(old.products, product, e.data.action),
      }));
    };

    ORDER_UPDATE_EVENTS.forEach((event) =>
      channel.listen(event, handleOrderUpdated),
    );
    channel.listen(".order.status_changed", handleStatusChanged);
    channel.listen(".order.called_changed", handleCalledChanged);
    channel.listen(".order.comment_added", handleCommentAdded);
    channel.listen(".order.document_added", handleDocumentAdded);
    channel.listen(".order.payment_changed", handlePaymentChanged);
    channel.listen(".order.service_changed", handleServiceChanged);
    channel.listen(".order.product_changed", handleProductChanged);

    return () => {
      echo.leave(channelName);
    };
  }, [orderId, queryClient]);
};
