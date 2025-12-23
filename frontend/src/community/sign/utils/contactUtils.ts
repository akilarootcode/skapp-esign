export const extractPhoneInfo = (phoneString: string | null) => {
  if (!phoneString) return { countryCode: "", contactNo: "" };

  const spaceIndex = phoneString.indexOf(" ");

  let countryCode = phoneString.substring(0, spaceIndex).trim();
  const contactNo = phoneString.substring(spaceIndex + 1).trim();

  if (!countryCode.startsWith("+")) {
    countryCode = "+" + countryCode;
  }

  return { countryCode, contactNo };
};

export const getContactExternalFullName = (
  firstName: string | undefined,
  lastName?: string | undefined
): string => {
  if (!firstName) return "";

  return firstName + (lastName ? ` ${lastName}` : "");
};
