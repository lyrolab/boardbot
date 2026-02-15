import { createMock } from "@golevelup/ts-vitest"
import type { MockFactory } from "@nestjs/testing"

/**
 * Typed wrapper around `createMock` compatible with NestJS `useMocker()`.
 *
 * `createMock`'s signature doesn't match `MockFactory` (it expects
 * `PartialFuncReturn<T>`, not `InjectionToken`), but at runtime the
 * Proxy-based implementation works correctly regardless of what's passed.
 */
export const mockFactory: MockFactory = createMock as MockFactory
