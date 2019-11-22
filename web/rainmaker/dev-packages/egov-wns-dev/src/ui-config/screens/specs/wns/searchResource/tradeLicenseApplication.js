import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCall } from "./functions";

const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.applicationNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.NOCNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.ownerMobNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.applicationNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.fromDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "search",
      "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.toDate",
      "props.value",
      ""
    )
  );
};

export const tradeLicenseApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelKey: "WS_SEARCH_CONNECTION_HEADER"
  }),
  subParagraph: getCommonParagraph({
    labelKey: "WS_HOME_SEARCH_RESULTS_DESC"
  }),
  appTradeAndMobNumContainer: getCommonContainer({
    consumerNo: getTextField({
      label: {
        labelKey: "WS_HOME_SEARCH_RESULTS_CONSUMER_NO_LABEL"
      },
      placeholder: {
        labelName: "Select ULB",
        labelKey: "WS_HOME_SEARCH_RESULTS_CONSUMER_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      // required: true,
      errorMessage: "ERR_INVALID_ULB",
      jsonPath: "searchScreen.ulb"
    }),

    // applicationNo: getTextField({
    //   label: {
    //     labelKey: "WS_HOME_SEARCH_RESULTS_APP_NO_LABEL"
    //   },
    //   placeholder: {
    //     labelKey: "WS_HOME_SEARCH_RESULTS_APP_NO_PLACEHOLDER"
    //   },
    //   gridDefination: {
    //     xs: 12,
    //     sm: 4
    //   },
    //   required: false,
    //   pattern: /^[a-zA-Z0-9-]*$/i,
    //   // errorMessage: "ERR_INVALID_CONSUMER_NO",
    //   // jsonPath: "searchScreen.applicationNumber"
    // }),

    ownerMobNo: getTextField({
      label: {
        labelKey: "WS_HOME_SEARCH_RESULTS_OWN_MOB_LABEL"
      },
      placeholder: {
        labelKey: "WS_HOME_SEARCH_RESULTS_OWN_MOB_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      // required: true,
      errorMessage: "ERR_INVALID_TRADE_LICENSE_NO",
      jsonPath: "searchScreen.billingYear"
    }),
    billingPeriod: getSelectField({
      label: {
        labelKey: "WS_HOME_SEARCH_RESULTS_APP_STATUS_LABEL"
      },
      placeholder: {
        labelKey: "WS_HOME_SEARCH_RESULTS_APP_STATUS_PLACEHOLDER"
      },
      required: false,
      localePrefix: {
        moduleName: "WF",
        masterName: "NEWTL"
      },
      jsonPath: "searchScreen.status",
      sourceJsonPath: "applyScreenMdmsData.searchScreen.status",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      // required: true,
      errorMessage: "ERR_INVALID_TRADE_LICENSE_NO",
      jsonPath: "searchScreen.billingPeriod"
    }),

    fromDate: getDateField({
      label: { labelName: "From Date", labelKey: "WS_COMMON_FROM_DATE_LABEL" },
      placeholder: {
        labelName: "Select From Date",
        labelKey: "WS_FROM_DATE_PLACEHOLDER"
      },
      jsonPath: "searchScreen.fromDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      // required: true,
      errorMessage: "ERR_INVALID_TRADE_LICENSE_NO",
      jsonPath: "searchScreen.billingPeriodValue"
    }),

    toDate: getDateField({
      label: { labelName: "To Date", labelKey: "WS_COMMON_TO_DATE_LABEL" },
      placeholder: {
        labelName: "Select to Date",
        labelKey: "WS_COMMON_TO_DATE_PLACEHOLDER"
      },
      jsonPath: "searchScreen.toDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_INVALID_DATE",
      required: false
    })
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      mihyEmptyRow: {
        uiFramework: "custom-atoms",
        componentPath: "Item",
        props: {
          sm: 2
        }
      },
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            width: "70%",
            height: "48px",
            margin: "8px",
          }
        },
        children: {
          buttonLabel: getLabel({
            labelKey: "WS_SEARCH_CONNECTION_RESET_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "70%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelKey: "WS_SEARCH_CONNECTION_SEARCH_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      },
      mihyEmptyRow: {
        uiFramework: "custom-atoms",
        componentPath: "Item",
        props: {
          sm: 2
        }
      },
    })
  })
});
