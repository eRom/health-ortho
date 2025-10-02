import { cn } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("cn utility function", () => {
  it("should merge class names", () => {
    const result = cn("text-red-500", "bg-blue-500");
    expect(result).toBe("text-red-500 bg-blue-500");
  });

  it("should handle conditional classes", () => {
    const result = cn("base-class", true && "conditional-class");
    expect(result).toBe("base-class conditional-class");
  });

  it("should handle tailwind conflicts with twMerge", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("should handle undefined and null values", () => {
    const result = cn("base-class", undefined, null, "another-class");
    expect(result).toBe("base-class another-class");
  });

  it("should handle arrays", () => {
    const result = cn(["class1", "class2"], "class3");
    expect(result).toBe("class1 class2 class3");
  });
});

