import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/queryKeys.ts";
import Loader from "@/shared/components/common/Loader.tsx";
import { QueryPageGuard } from "@/shared/components/errors/QueryPageGuard.tsx";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { usersApi } from "../api";

const UsersPage = () => {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: usersApi.getUsers,
  });

  return (
    <QueryPageGuard
      isError={isError}
      error={error}
      isLoading={isLoading}
      loadingFallback={<Loader />}
      onRetry={() => refetch()}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Пользователи</h1>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.status === "active" ? (
                      <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:border-green-900 dark:hover:bg-green-900">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:border-red-900 dark:hover:bg-red-900">
                        Blocked
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {users?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Пользователей не найдено.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </QueryPageGuard>
  );
};

export default UsersPage;
