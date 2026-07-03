import { mapCustomerDtoToCustomer } from "@/features/backoffice/modules/customers/lib/adapters.ts";
import type {
  PaginatedSmsMessagesDto,
  SmsBalanceDto,
  SmsMessageDto,
} from "@/features/backoffice/modules/sms-integration/api/dto.ts";
import type {
  SmsBalance,
  SmsMessage,
} from "@/features/backoffice/modules/sms-integration/types.ts";
import type { PaginatedResponse } from "@/features/backoffice/widgets/table/models/types.ts";

export function mapSmsBalanceDtoToSmsBalance(dto: SmsBalanceDto): SmsBalance {
  return {
    amount: dto.amount,
    lowBalanceThreshold: dto.low_balance_threshold,
    isLow: dto.is_low,
  };
}

export function mapSmsMessageDtoToSmsMessage(dto: SmsMessageDto): SmsMessage {
  return {
    id: dto.id,
    customer: dto.customer ? mapCustomerDtoToCustomer(dto.customer) : null,
    provider: dto.provider,
    providerMessageId: dto.provider_message_id ?? null,
    phone: dto.phone,
    text: dto.text,
    status: dto.status,
    providerStatus: dto.provider_status ?? null,
    price: dto.price ?? null,
    segments: dto.segments ?? null,
    error: dto.error ?? null,
    sentAt: dto.sent_at ?? null,
    deliveredAt: dto.delivered_at ?? null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapPaginatedSmsMessagesDtoToResponse(
  dto: PaginatedSmsMessagesDto,
): PaginatedResponse<SmsMessage> {
  return {
    items: dto.data.map(mapSmsMessageDtoToSmsMessage),
    meta: {
      currentPage: dto.meta.current_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
    },
  };
}
