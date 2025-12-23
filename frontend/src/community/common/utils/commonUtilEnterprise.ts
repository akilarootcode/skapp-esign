import ROUTES from "~community/common/constants/routes";
import { FileCategories } from "~community/common/types/s3Types";

export const isEnterpriseProTenant = () => {
  if (typeof window !== "undefined") {
    const subDomain = window.location.hostname.split(".")[0];
    const proTenants = process?.env?.NEXT_PUBLIC_EP_PRO_TENANTS?.split(",");
    return proTenants?.includes(subDomain);
  }
};

export const containsEncodedComponents = (URI: string) => {
  return decodeURI(URI) !== decodeURIComponent(URI);
};

export const getProfilePicOriginalUrl = (filePath: string): string => {
  if (!filePath || typeof filePath !== "string") {
    return "";
  }

  return `${FileCategories.PROFILE_PICTURES_ORIGINAL}/${filePath}`;
};

export const getProfilePicThumbnailUrl = (
  filePath: string | undefined
): string => {
  if (!filePath || typeof filePath !== "string") {
    return "";
  }

  return `${FileCategories.PROFILE_PICTURES_THUMBNAIL}/${filePath}`;
};

export const getSubdomain = (
  url: string,
  multipleValues: boolean = false
): string | string[] => {
  if (!url) return multipleValues ? [] : "";
  const parts = url.split(".");
  return multipleValues ? parts : parts[0];
};

export const getTenantID = () => {
  if (typeof window === "undefined") return "";
  return getSubdomain(window.location.hostname);
};

export const needsToShow = (tenantID: string) => {
  const prodTestTenants =
    process.env.NEXT_PUBLIC_PROD_TEST_TENANTS?.split(",") || [];

  const isEnterpriseProductionMode =
    process.env.NEXT_PUBLIC_ENTERPRISE_MODE === "prod";
  if (!isEnterpriseProductionMode) {
    return true;
  }
  if (prodTestTenants.includes(tenantID)) {
    return true;
  } else {
    return false;
  }
};

export const shouldUseDefaultTheme = (asPath: string): boolean => {
  const defaultThemeRoutes: string[] = [ROUTES.SIGN.SIGN];

  const currentRoute = asPath.split("?")[0];

  return defaultThemeRoutes.includes(currentRoute);
};

export const buildUrlWithPartnerId = (
  baseUrl: string,
  partnerId?: string | null
): string => {
  if (partnerId) {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}partnerId=${partnerId}`;
  }

  return baseUrl;
};

/**
 * Check if the current tenant should use the custom APICTA dashboard UI
 */
export const tempShouldUseCustomDashboard = (tenantName?: string): boolean => {
  if (!tenantName) return false;

  const customDashboardTenants =
    process.env.NEXT_PUBLIC_CUSTOM_DASHBOARD_TENANTS || "";
  const tenantList = customDashboardTenants.split(",");

  return tenantList.includes(tenantName);
};
