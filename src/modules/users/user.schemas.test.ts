import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { registerUserSchema } from "@/modules/users/user.schemas";

const baseInput = {
  fullName: "Test User",
  email: "test@example.com",
  password: "Valid123",
  organizationSlug: "demo-school",
};

describe("registerUserSchema", () => {
  it("accepts blank optional fields", () => {
    const parsed = registerUserSchema.parse({
      ...baseInput,
      role: "student",
      parentEmail: "",
      representedStudentEmail: "",
      organizationSlug: "",
    });

    expect(parsed.parentEmail).toBeUndefined();
    expect(parsed.representedStudentEmail).toBeUndefined();
    expect(parsed.organizationSlug).toBeUndefined();
  });

  it("accepts student without parentEmail", () => {
    const parsed = registerUserSchema.parse({
      ...baseInput,
      role: "student",
    });

    expect(parsed.parentEmail).toBeUndefined();
  });

  it("rejects parentEmail for non-student roles", () => {
    expect(() =>
      registerUserSchema.parse({
        ...baseInput,
        role: "parent",
        parentEmail: "other@example.com",
      }),
    ).toThrow(ZodError);
  });

  it("accepts parentEmail when role is student", () => {
    const parsed = registerUserSchema.parse({
      ...baseInput,
      role: "student",
      parentEmail: "PARENT@Example.com",
    });

    expect(parsed.parentEmail).toBe("parent@example.com");
  });
});
