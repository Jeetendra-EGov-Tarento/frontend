import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../..//ui-utils/commons";
import {
  convertEpochToDate,
  convertDateToEpoch,
  getTextToLocalMapping
} from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  let queryObject = [
    {
      key: "tenantId",
      value: JSON.parse(getUserInfo()).tenantId
    },
    { key: "offset", value: "0" }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.tradeLicenseApplication.children.cardContent.children.appTradeAndMobNumContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.tradeLicenseApplication.children.cardContent.children.appStatusAndToFromDateContainer.children",
    state,
    dispatch,
    "search"
  );

  // if ((isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
  //   dispatch(
  //     toggleSnackbar(
  //       true,
  //       {
  //         labelName: "Please fill valid fields to start search",
  //         labelKey: "ERR_FILL_VALID_FIELDS"
  //       },
  //       "warning"
  //     )
  //   );
  // } else if (
  //   Object.keys(searchScreenObject).length == 0 ||
  //   Object.values(searchScreenObject).every(x => x === "")
  // ) {
  //   dispatch(
  //     toggleSnackbar(
  //       true,
  //       {
  //         labelName: "Please fill at least one field to start search",
  //         labelKey: "ERR_FILL_ONE_FIELDS"
  //       },
  //       "warning"
  //     )
  //   );
  // } else if (
  //   (searchScreenObject["fromDate"] === undefined ||
  //     searchScreenObject["fromDate"].length === 0) &&
  //   searchScreenObject["toDate"] !== undefined &&
  //   searchScreenObject["toDate"].length !== 0
  // ) {
  //   dispatch(
  //     toggleSnackbar(
  //       true,
  //       { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" },
  //       "warning"
  //     )
  //   );
  // } else {
  //   for (var key in searchScreenObject) {
  //     if (
  //       searchScreenObject.hasOwnProperty(key) &&
  //       searchScreenObject[key].trim() !== ""
  //     ) {
  //       if (key === "fromDate") {
  //         queryObject.push({
  //           key: key,
  //           value: convertDateToEpoch(searchScreenObject[key], "daystart")
  //         });
  //       } else if (key === "toDate") {
  //         queryObject.push({
  //           key: key,
  //           value: convertDateToEpoch(searchScreenObject[key], "dayend")
  //         });
  //       } else {
  //         queryObject.push({ key: key, value: searchScreenObject[key].trim() });
  //       }
  //     }
  //   }

  // const response = await getSearchResults(queryObject);
  const response = { 'Licenses': [{ "tenantId": "123", "applicationNumber": "PB-WS-AN-2019-23", "consumerNumber": 'PB-WS-CN-2019-23', "ownerName": "Satinder Pal", "status": "Active", "due": "4200" }] }
  try {
    let data = response.Licenses.map(item => ({
      [getTextToLocalMapping("Application No")]:
        item.applicationNumber || "-",
      [getTextToLocalMapping("Consumer No")]: item.consumerNumber || "-",
      [getTextToLocalMapping("Owner Name")]:
        item.ownerName || "-",
      [getTextToLocalMapping("Status")]: item.status || "-",
      [getTextToLocalMapping("Due")]: item.due || "-",
      ["tenantId"]: item.tenantId
    }));

    dispatch(
      handleField(
        "search",
        "components.div.children.searchResults",
        "props.data",
        data
      )
    );
    dispatch(
      handleField(
        "search",
        "components.div.children.searchResults",
        "props.title",
        `${getTextToLocalMapping(
          "Search Results for Water & Sewerage Connections"
        )} (${response.Licenses.length})`
      )
    );
    showHideTable(true, dispatch);
  } catch (error) {
    dispatch(toggleSnackbar(true, error.message, "error"));
    console.log(error);
  }
}
// };
const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
