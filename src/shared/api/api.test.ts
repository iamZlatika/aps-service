import type { AxiosResponse } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { ApiError } from "@/shared/lib/errors/services.ts";

import { del, get, post, put } from "./api";
import { apiClient } from "./apiClient";

const mockedClient = vi.mocked(apiClient, { deep: true });

function mockResponse<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: { headers: {} },
  } as AxiosResponse<T>;
}

describe("http methods", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("get: should call apiClient.get and return data", async () => {
    const mockData = { id: 1 };
    mockedClient.get.mockResolvedValue(mockResponse(mockData));

    const result = await get("/test");

    expect(mockedClient.get).toHaveBeenCalledWith("/test", undefined);
    expect(result).toEqual(mockData);
  });

  it("post: should call apiClient.post with data and return response data", async () => {
    const requestData = { name: "Zlata" };
    const responseData = { success: true };
    mockedClient.post.mockResolvedValue(mockResponse(responseData));

    const result = await post("/users", requestData);

    expect(mockedClient.post).toHaveBeenCalledWith(
      "/users",
      requestData,
      undefined,
    );
    expect(result).toEqual(responseData);
  });

  it("put: should call apiClient.put and return data", async () => {
    const responseData = { updated: true };
    mockedClient.put.mockResolvedValue(mockResponse(responseData));

    const result = await put("/users/1", { name: "New" });

    expect(mockedClient.put).toHaveBeenCalledWith(
      "/users/1",
      { name: "New" },
      undefined,
    );
    expect(result).toEqual(responseData);
  });

  it("del: should call apiClient.delete and return data", async () => {
    const responseData = { deleted: true };
    mockedClient.delete.mockResolvedValue(mockResponse(responseData));

    const result = await del("/users/1");

    expect(mockedClient.delete).toHaveBeenCalledWith("/users/1", undefined);
    expect(result).toEqual(responseData);
  });
  it("get: should throw ApiError on error", async () => {
    const error = new ApiError("Network Error", 500);
    mockedClient.get.mockRejectedValue(error);

    const promise = get("/fail");

    expect(promise).rejects.toThrow(ApiError);
    expect(promise).rejects.toThrow("Network Error");
  });

  it("post: should throw ApiError on error", async () => {
    const error = new ApiError("Server Error", 500);
    mockedClient.post.mockRejectedValue(error);

    expect(post("/fail", { data: 1 })).rejects.toThrow(ApiError);
  });

  it("put: should throw ApiError on error", async () => {
    const error = new ApiError("Not Found", 404);
    mockedClient.put.mockRejectedValue(error);

    expect(put("/fail", { data: 1 })).rejects.toThrow(ApiError);
  });

  it("del: should throw ApiError on error", async () => {
    const error = new ApiError("Forbidden", 403);
    mockedClient.delete.mockRejectedValue(error);

    expect(del("/fail")).rejects.toThrow(ApiError);
  });
});
