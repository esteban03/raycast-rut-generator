import { describe, expect, it } from "vitest";
import { calculateVerificationDigit, formatRut } from "../src/rut";

describe("RUT utilities", () => {
  it("calculates known verification digits", () => {
    expect(calculateVerificationDigit(12345678)).toBe("5");
    expect(calculateVerificationDigit(11111111)).toBe("1");
    expect(calculateVerificationDigit(76086428)).toBe("5");
    expect(calculateVerificationDigit(9999999)).toBe("3");
  });

  it("formats a RUT in the supported variants", () => {
    expect(formatRut(12345678, "5", "dots")).toBe("12.345.678-5");
    expect(formatRut(12345678, "5", "dash")).toBe("12345678-5");
    expect(formatRut(12345678, "5", "plain")).toBe("123456785");
  });
});
