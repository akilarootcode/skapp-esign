import {
  Box,
  CircularProgress,
  InputBase,
  Paper,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import {
  ChangeEvent,
  KeyboardEvent,
  Ref,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import Popper from "~community/common/components/molecules/Popper/Popper";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import {
  shouldMoveDownward,
  shouldMoveUpward,
  shouldSelectDropdownOption
} from "~community/common/utils/keyboardUtils";
import { ESignSearchBookSuggestionType } from "~community/sign/types/ESignFormTypes";

interface Props {
  id?: string;
  placeHolder?: string;
  value?: string;
  error: string | null;
  isAutoFocus?: boolean;
  isFullWidth?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  inputName?: string;
  isErrorTextAvailable?: boolean;
  needSearchIcon?: boolean;
  isPopperOpen: boolean;
  setIsPopperOpen: (isOpen: boolean) => void;
  parentRef?: RefObject<HTMLDivElement | null>;
  suggestions?: ESignSearchBookSuggestionType[];
  onAddButtonClick?: () => void;
  onSelectUser: (user: ESignSearchBookSuggestionType) => void;
  ref?: Ref<HTMLHeadingElement>;
}

const RecipientSearch = ({
  id,
  placeHolder,
  value,
  error,
  isAutoFocus,
  isFullWidth,
  isLoading,
  onChange,
  onFocus,
  isDisabled,
  inputName,
  isErrorTextAvailable,
  needSearchIcon = true,
  isPopperOpen,
  setIsPopperOpen,
  parentRef,
  suggestions,
  onAddButtonClick,
  onSelectUser,
  onBlur
}: Props) => {
  const translateText = useTranslator(
    "eSignatureModule",
    "create.recipientDetails.recipientDetails"
  );
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "recipientSearch"
  );
  const theme = useTheme();
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const addButtonRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Expose the input ref to parent componentss
  useImperativeHandle(ref, () => inputRef.current as HTMLDivElement, []);

  useEffect(() => {
    setHighlightedIndex(-1);
    if (suggestions) {
      suggestionRefs.current = Array(suggestions.length + 1).fill(null);
    }
  }, [suggestions, isPopperOpen]);

  const handleInputChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    onChange?.(e);
  };

  const handleSuggestionSelect = (item: ESignSearchBookSuggestionType) => {
    onSelectUser(item);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isPopperOpen) {
      return;
    }
    const totalOptions = (suggestions?.length || 0) + 1;

    if (shouldMoveDownward(e.key)) {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => {
        const nextIndex = prevIndex < totalOptions - 1 ? prevIndex + 1 : 0;
        return nextIndex;
      });
    } else if (shouldMoveUpward(e.key)) {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => {
        const nextIndex = prevIndex > 0 ? prevIndex - 1 : totalOptions - 1;
        return nextIndex;
      });
    } else if (shouldSelectDropdownOption(e.key) && highlightedIndex >= 0) {
      e.preventDefault();
      if (suggestions && highlightedIndex === suggestions.length) {
        onAddButtonClick?.();
      } else if (
        suggestions &&
        highlightedIndex >= 0 &&
        highlightedIndex < suggestions.length
      ) {
        handleSuggestionSelect(suggestions[highlightedIndex]);
      }
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0) {
      const element =
        highlightedIndex < (suggestions?.length || 0)
          ? suggestionRefs.current[highlightedIndex]
          : addButtonRef.current;

      if (element) {
        element.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, suggestions?.length]);

  return (
    <Box
      sx={{
        width: "100%"
      }}
    >
      <Box ref={ref}>
        <Box>
          <Paper
            ref={inputRef}
            component="div"
            elevation={0}
            sx={{
              p: "0.5rem 0.9375rem",
              display: "flex",
              alignItems: "center",
              background: error
                ? theme.palette.error.light
                : theme.palette.grey[100],
              borderRadius: "0.5rem",
              border: error
                ? `0.0625rem solid ${theme.palette.error.contrastText}`
                : ""
            }}
          >
            <InputBase
              id={id ?? "search-input"}
              sx={{ flex: 1, "& input::placeholder": { fontSize: "1rem" } }}
              placeholder={placeHolder}
              fullWidth={isFullWidth}
              onFocus={onFocus}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              value={value}
              disabled={isDisabled}
              autoFocus={isAutoFocus}
              name={inputName}
              autoComplete="off"
              tabIndex={isDisabled ? -1 : 0}
              inputProps={{
                role: "combobox",
                "aria-controls": isPopperOpen ? "suggestionPopper" : undefined,
                "aria-haspopup": "listbox",
                "aria-autocomplete": "list",
                "aria-expanded": isPopperOpen,
                "aria-activedescendant":
                  highlightedIndex >= 0
                    ? `suggestion-${highlightedIndex}`
                    : undefined,
                "aria-label": translateAria(["recipientSearchInput"]),
                "aria-describedby": error ? `${id}-error` : undefined,
                "aria-invalid": error ? "true" : "false"
              }}
              onBlur={onBlur}
            />
            {needSearchIcon && !value && (
              <Icon
                name={IconName.SEARCH_ICON}
                aria-hidden="true"
                aria-label={translateAria(["searchIcon"])}
              />
            )}
          </Paper>
          {!!error && isErrorTextAvailable && (
            <Typography
              id={`${id}-error`}
              variant="body2"
              sx={{
                color: theme.palette.error.contrastText,
                fontSize: "0.875rem",
                mt: "0.5rem",
                lineHeight: "1rem"
              }}
              role="alert"
              aria-live="assertive"
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
      {(ref.current || parentRef) && (
        <Popper
          open={isPopperOpen}
          anchorEl={parentRef ? parentRef.current : ref.current}
          position={"bottom-start"}
          menuType={MenuTypes.SEARCH}
          isManager={true}
          handleClose={() => setIsPopperOpen(false)}
          id={"suggestionPopper"}
          ariaLabel={translateAria(["suggestionList"])}
          containerStyles={{
            width: "100%",
            mt: "8px"
          }}
        >
          <Box
            role="listbox"
            id="suggestionPopper"
            aria-label={translateAria(["suggestionList"])}
            tabIndex={-1}
            sx={{
              backgroundColor: theme.palette.common.white,
              borderRadius: "0.75rem",
              maxHeight: "11.25rem",
              overflowY: "auto",
              overflowX: "hidden",
              width: "100%"
            }}
          >
            {isLoading && (
              <Stack
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1rem"
                }}
                aria-live="polite"
                aria-label={translateAria(["loadingSuggestions"])}
                role="status"
              >
                <CircularProgress
                  sx={{
                    color: theme.palette.primary.main
                  }}
                />
              </Stack>
            )}
            {suggestions &&
              suggestions.length > 0 &&
              suggestions.map((item, index) => (
                <Stack
                  ref={(el) => (suggestionRefs.current[index] = el)}
                  role="option"
                  id={`suggestion-${index}`}
                  aria-selected={index === highlightedIndex}
                  aria-label={translateAria(["recipientSuggestion"], {
                    email: item.email
                  })}
                  onClick={() => handleSuggestionSelect(item)}
                  key={item.addressBookId}
                  tabIndex={-1}
                  sx={{
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    backgroundColor:
                      index === highlightedIndex
                        ? theme.palette.grey[100]
                        : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.grey[100]
                    },
                    outline:
                      index === highlightedIndex
                        ? `0.0625rem solid ${theme.palette.primary.main}`
                        : "none"
                  }}
                >
                  <Typography>{item?.email}</Typography>
                </Stack>
              ))}
            <Stack
              ref={addButtonRef}
              role="option"
              id={`suggestion-${suggestions?.length || 0}`}
              aria-selected={suggestions?.length === highlightedIndex}
              aria-label={translateAria(["addNewRecipient"])}
              tabIndex={-1}
              sx={{
                padding: "12px 16px",
                backgroundColor: theme.palette.secondary.main,
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                outline:
                  suggestions?.length === highlightedIndex
                    ? `0.0625rem solid ${theme.palette.primary.main}`
                    : "none"
              }}
              onClick={onAddButtonClick}
            >
              <Typography
                sx={{
                  color: theme.palette.primary.dark
                }}
              >
                {translateText(["newExternalRecipient"])}
              </Typography>
              <Icon
                name={IconName.PLUS_ICON}
                fill={theme.palette.primary.dark}
                aria-hidden="true"
              />
            </Stack>
          </Box>
        </Popper>
      )}
    </Box>
  );
};

export default RecipientSearch;
