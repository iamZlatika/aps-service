import { describe, expect, it } from "vitest";

import { normalizePhoneSearchQuery } from "./phone";

describe("normalizePhoneSearchQuery", () => {
  it("strips mask characters from a full phone number", () => {
    expect(normalizePhoneSearchQuery("099-732-66-75")).toBe("0997326675");
    expect(normalizePhoneSearchQuery("+38 (099) 732-66-75")).toBe(
      "380997326675",
    );
  });

  it("leaves non-phone queries untouched", () => {
    expect(normalizePhoneSearchQuery("APS-0128")).toBe("APS-0128");
    expect(normalizePhoneSearchQuery("0128-1")).toBe("0128-1");
    expect(normalizePhoneSearchQuery("Иван")).toBe("Иван");
    expect(normalizePhoneSearchQuery("")).toBe("");
  });
});
