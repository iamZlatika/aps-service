import { describe, expect, it } from "vitest";

import { workSchema } from "@/features/works/lib/work.schema";
import { workEditSchema } from "@/features/works/lib/work-edit.schema";

const photo = new File(["x"], "a.jpg", { type: "image/jpeg" });
const base = {
  device_type: "Ноутбук",
  manufacturer: "Lenovo",
  device_model: "IdeaPad 3",
  description_ru: "Описание",
  description_uk: "Опис",
  reason_ru: "",
  reason_uk: "",
  is_published: false,
};

function errorPaths(result: {
  success: boolean;
  error?: { issues: { path: PropertyKey[] }[] };
}): string[] {
  return (result.error?.issues ?? []).map((issue) => issue.path.join("."));
}

describe("workSchema", () => {
  it("a repair needs both reasons and both photos", () => {
    const result = workSchema.safeParse({ ...base, type: "repair" });
    expect(errorPaths(result).sort()).toEqual(
      ["after_photo", "before_photo", "reason_ru", "reason_uk"].sort(),
    );
  });

  it("an upgrade needs the main photo only", () => {
    const missing = workSchema.safeParse({ ...base, type: "upgrade" });
    expect(errorPaths(missing)).toEqual(["main_photo"]);
    const ok = workSchema.safeParse({
      ...base,
      type: "upgrade",
      main_photo: photo,
    });
    expect(ok.success).toBe(true);
  });

  it("descriptions are always required, whitespace is not text", () => {
    const result = workSchema.safeParse({
      ...base,
      type: "upgrade",
      main_photo: photo,
      description_uk: "   ",
    });
    expect(errorPaths(result)).toEqual(["description_uk"]);
  });
});

describe("workEditSchema", () => {
  it("requires the reasons for a repair only", () => {
    const { is_published: _, ...values } = base;
    expect(errorPaths(workEditSchema("repair").safeParse(values))).toEqual([
      "reason_ru",
      "reason_uk",
    ]);
    expect(workEditSchema("upgrade").safeParse(values).success).toBe(true);
  });
});
