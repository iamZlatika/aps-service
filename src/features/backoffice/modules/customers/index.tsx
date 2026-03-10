import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { customersApi } from "./api";

const CustomersPage = () => {
  const {
    data: customers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getCustomers,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Загрузка клиентов...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-full text-destructive">
        Ошибка при загрузке данных
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Клиенты</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Телефоны</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата создания</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email || "-"}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {customer.phones.map((phone) => (
                      <div key={phone.id} className="text-sm">
                        {phone.phoneNumber}{" "}
                        {phone.isPrimary && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">
                            Основной
                          </span>
                        )}
                      </div>
                    ))}
                    {customer.phones.length === 0 && "-"}
                  </div>
                </TableCell>
                <TableCell>
                  {customer.status === "active" ? (
                    <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:border-green-900 dark:hover:bg-green-900">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-900 dark:hover:bg-red-900">
                      Blocked
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(customer.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {customers?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Клиенты не найдены.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomersPage;
