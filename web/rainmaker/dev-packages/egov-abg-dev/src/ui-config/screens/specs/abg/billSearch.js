import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { billSearchCard } from "./billSearchResources/billSearchCard";
import { searchResults } from "./billSearchResources/searchResults";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

const header = getCommonHeader({
  labelName: "Universal Bill",
  labelKey: "ABG_UNIVERSAL_BILL_COMMON_HEADER"
});
const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const getMDMSData = async (action, state, dispatch) => {
  const tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
       {
          moduleName: "BillingService",
          masterDetails: [
            {
              name: "BusinessService"
            }
          ]
        },
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        }
      ]
    }
  };
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const getData = async (action, state, dispatch) => {
  await getMDMSData(action, state, dispatch);
};

const billSearchAndResult = {
  uiFramework: "material-ui",
  name: "billSearch",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "billSearch"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
            groupBillButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right"
              },
              visible: enableButton,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px"
                }
              },
              children: {
                ButtonLabel: getLabel({
                  labelName: "Group Bills",
                  labelKey: "ABG_COMMON_HEADER"
                })
              },
              onClickDefination: {
                action: "page_change",
                path:
                  process.env.REACT_APP_SELF_RUNNING === "true"
                    ? `/egov-ui-framework/abg/groupBills`
                    : `/abg/groupBills`
              },
              visible: process.env.REACT_APP_NAME === "Citizen" ? false : true
            }
          }
        },
        billSearchCard,
        breakAfterSearch: getBreak(),
        searchResults
      }
    }
  }
};

export default billSearchAndResult;
