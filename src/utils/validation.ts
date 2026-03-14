/**
 * Input Validation & Sanitization Utilities
 * Prevents security vulnerabilities and invalid inputs
 */

/**
 * Sanitize user input to remove potential XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML-like tags
    .trim()
    .slice(0, 1000); // Limit length
}

/**
 * Validate mathematical expression format
 */
export function validateMathExpression(expr: string): {
  valid: boolean;
  error?: string;
} {
  if (!expr) return { valid: false, error: 'Expression cannot be empty' };
  if (expr.length > 500) return { valid: false, error: 'Expression too long' };

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /eval\(/i,
    /import\(/i,
    /require\(/i,
    /function\(/i,
    /\.constructor/i,
    /\.prototype/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(expr)) {
      return { valid: false, error: 'Invalid characters in expression' };
    }
  }

  // Check for balanced parentheses
  let parenCount = 0;
  for (const char of expr) {
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (parenCount < 0) return { valid: false, error: 'Unbalanced parentheses' };
  }
  if (parenCount !== 0) return { valid: false, error: 'Unbalanced parentheses' };

  return { valid: true };
}

/**
 * Validate file size for uploads
 */
export function validateFileSize(
  file: File,
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }
  return { valid: true };
}

/**
 * Validate file type
 */
export function validateFileType(
  file: File,
  allowedTypes: string[] = ['image/png', 'image/jpeg', 'image/webp']
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not supported. Allowed: ${allowedTypes.join(', ')}` };
  }
  return { valid: true };
}

/**
 * Rate limiting - prevent abuse
 */
export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    return false;
  }

  remaining(): number {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }
}

/**
 * Create a rate limiter instance for safe solver usage
 */
export const solverRateLimiter = new RateLimiter(50, 60000); // 50 requests per minute

/**
 * Validate and sanitize user content for display
 */
export function sanitizeForDisplay(text: string): string {
  return sanitizeInput(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate safe HTML from LaTeX-like math expressions
 */
export function validateMathOutput(result: string): { valid: boolean; error?: string } {
  if (!result) return { valid: false, error: 'Empty result' };
  if (result.length > 5000) return { valid: false, error: 'Result too long' };
  if (result.includes('Infinity')) return { valid: true }; // Allow Infinity
  if (result.includes('NaN')) return { valid: false, error: 'Invalid calculation result' };
  return { valid: true };
}
