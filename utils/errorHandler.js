import React from "react";

/**
 * Dynamic Error Handling System for Frontend
 * Provides categorized error handling with user-friendly messages and actions
 */

// Error categories
export const ERROR_TYPES = {
  NETWORK: "network",
  VALIDATION: "validation",
  SERVER: "server",
  AUTHENTICATION: "authentication",
  PERMISSION: "permission",
  TIMEOUT: "timeout",
  UNKNOWN: "unknown",
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

/**
 * Error message configurations with user-friendly text and actions
 */
const ERROR_CONFIGS = {
  [ERROR_TYPES.NETWORK]: {
    title: "Connection Error",
    messages: {
      default:
        "Unable to connect to the server. Please check your internet connection.",
      timeout: "Request timed out. The server might be busy.",
      offline:
        "You're currently offline. Please check your connection and try again.",
    },
    severity: ERROR_SEVERITY.MEDIUM,
    actions: ["retry", "checkConnection"],
    icon: "📡",
  },

  [ERROR_TYPES.VALIDATION]: {
    title: "Invalid Input",
    messages: {
      default: "Please check your input and try again.",
      required: "Required fields are missing.",
      format: "Please enter information in the correct format.",
      range: "Values are outside the allowed range.",
    },
    severity: ERROR_SEVERITY.LOW,
    actions: ["fixInput"],
    icon: "⚠️",
  },

  [ERROR_TYPES.SERVER]: {
    title: "Server Error",
    messages: {
      default: "Something went wrong on our end. Please try again later.",
      maintenance: "System is currently under maintenance.",
      overload:
        "Server is temporarily overloaded. Please try again in a few minutes.",
    },
    severity: ERROR_SEVERITY.HIGH,
    actions: ["retry", "contactSupport"],
    icon: "🔧",
  },

  [ERROR_TYPES.AUTHENTICATION]: {
    title: "Authentication Required",
    messages: {
      default: "Please log in to continue.",
      expired: "Your session has expired. Please log in again.",
      invalid: "Invalid credentials provided.",
    },
    severity: ERROR_SEVERITY.MEDIUM,
    actions: ["login"],
    icon: "🔐",
  },

  [ERROR_TYPES.PERMISSION]: {
    title: "Access Denied",
    messages: {
      default: "You don't have permission to perform this action.",
      location: "Location access is required for this feature.",
    },
    severity: ERROR_SEVERITY.MEDIUM,
    actions: ["requestPermission"],
    icon: "🚫",
  },

  [ERROR_TYPES.TIMEOUT]: {
    title: "Request Timeout",
    messages: {
      default: "The request took too long to complete.",
      slowConnection: "Your connection is slow. Please try again.",
    },
    severity: ERROR_SEVERITY.MEDIUM,
    actions: ["retry"],
    icon: "⏱️",
  },

  [ERROR_TYPES.UNKNOWN]: {
    title: "Unexpected Error",
    messages: {
      default: "An unexpected error occurred. Please try again.",
    },
    severity: ERROR_SEVERITY.HIGH,
    actions: ["retry", "reportBug"],
    icon: "❓",
  },
};

/**
 * Analyze error and categorize it
 * @param {Error} error - The error object
 * @returns {Object} Categorized error information
 */
export const categorizeError = (error) => {
  // Network errors
  if (!navigator.onLine) {
    return {
      type: ERROR_TYPES.NETWORK,
      subtype: "offline",
      ...ERROR_CONFIGS[ERROR_TYPES.NETWORK],
    };
  }

  if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
    return {
      type: ERROR_TYPES.TIMEOUT,
      subtype: "timeout",
      ...ERROR_CONFIGS[ERROR_TYPES.TIMEOUT],
    };
  }

  if (error.code === "NETWORK_ERROR" || error.message?.includes("network")) {
    return {
      type: ERROR_TYPES.NETWORK,
      subtype: "network",
      ...ERROR_CONFIGS[ERROR_TYPES.NETWORK],
    };
  }

  // HTTP status-based errors
  const status = error.response?.status;
  if (status) {
    if (status === 400) {
      return {
        type: ERROR_TYPES.VALIDATION,
        subtype: "format",
        ...ERROR_CONFIGS[ERROR_TYPES.VALIDATION],
      };
    }

    if (status === 401 || status === 403) {
      return {
        type: ERROR_TYPES.AUTHENTICATION,
        subtype: status === 401 ? "expired" : "invalid",
        ...ERROR_CONFIGS[ERROR_TYPES.AUTHENTICATION],
      };
    }

    if (status >= 500) {
      return {
        type: ERROR_TYPES.SERVER,
        subtype: "default",
        ...ERROR_CONFIGS[ERROR_TYPES.SERVER],
      };
    }
  }

  // Location/permission errors
  if (
    error.message?.includes("location") ||
    error.message?.includes("permission")
  ) {
    return {
      type: ERROR_TYPES.PERMISSION,
      subtype: "location",
      ...ERROR_CONFIGS[ERROR_TYPES.PERMISSION],
    };
  }

  // Default to unknown
  return {
    type: ERROR_TYPES.UNKNOWN,
    subtype: "default",
    ...ERROR_CONFIGS[ERROR_TYPES.UNKNOWN],
  };
};

/**
 * Get user-friendly error message
 * @param {Object} errorInfo - Error information from categorizeError
 * @param {string} customMessage - Optional custom message
 * @returns {string} User-friendly message
 */
export const getErrorMessage = (errorInfo, customMessage = null) => {
  if (customMessage) return customMessage;

  const config = ERROR_CONFIGS[errorInfo.type];
  return config.messages[errorInfo.subtype] || config.messages.default;
};

/**
 * Get error actions based on error type
 * @param {Object} errorInfo - Error information
 * @returns {Array} Available actions
 */
export const getErrorActions = (errorInfo) => {
  return ERROR_CONFIGS[errorInfo.type].actions || [];
};

/**
 * Handle error with appropriate user feedback
 * @param {Error} error - The error object
 * @param {Object} options - Options for error handling
 * @param {Function} options.onRetry - Retry callback
 * @param {Function} options.onDismiss - Dismiss callback
 * @param {string} options.customMessage - Custom error message
 * @returns {Object} Error handling result
 */
export const handleError = (error, options = {}) => {
  const { onRetry, onDismiss, customMessage } = options;

  const errorInfo = categorizeError(error);
  const message = getErrorMessage(errorInfo, customMessage);
  const actions = getErrorActions(errorInfo);

  // Log error for debugging
  console.error("Error handled:", {
    type: errorInfo.type,
    subtype: errorInfo.subtype,
    severity: errorInfo.severity,
    originalError: error,
    message,
  });

  return {
    errorInfo,
    message,
    actions,
    title: errorInfo.title,
    icon: errorInfo.icon,
    severity: errorInfo.severity,

    // Action handlers
    canRetry: actions.includes("retry"),
    canCheckConnection: actions.includes("checkConnection"),
    canFixInput: actions.includes("fixInput"),
    canLogin: actions.includes("login"),
    canRequestPermission: actions.includes("requestPermission"),
    canContactSupport: actions.includes("contactSupport"),
    canReportBug: actions.includes("reportBug"),

    // Callbacks
    onRetry,
    onDismiss,
  };
};

/**
 * React hook for dynamic error handling
 * @param {Object} options - Hook options
 * @returns {Object} Error handling state and functions
 */
export const useErrorHandler = (options = {}) => {
  const [currentError, setCurrentError] = React.useState(null);
  const [errorHistory, setErrorHistory] = React.useState([]);

  const processError = React.useCallback(
    (error, errorOptions = {}) => {
      const errorResult = handleError(error, {
        ...options,
        ...errorOptions,
        onDismiss: () => setCurrentError(null),
      });

      setCurrentError(errorResult);
      setErrorHistory((prev) => [
        ...prev,
        {
          ...errorResult,
          timestamp: new Date(),
          resolved: false,
        },
      ]);

      return errorResult;
    },
    [options]
  );

  const clearError = React.useCallback(() => {
    setCurrentError(null);
  }, []);

  const retryLastAction = React.useCallback(() => {
    if (currentError?.onRetry) {
      currentError.onRetry();
      setCurrentError(null);
    }
  }, [currentError]);

  return {
    currentError,
    errorHistory,
    handleError: processError,
    clearError,
    retryLastAction,
    hasError: !!currentError,
  };
};

export default {
  ERROR_TYPES,
  ERROR_SEVERITY,
  categorizeError,
  getErrorMessage,
  getErrorActions,
  handleError,
  useErrorHandler,
};
