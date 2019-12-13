
import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getStepperObject
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCurrentFinancialYear } from "../utils";
import { footer } from "./applyResource/footer";
import { transferorDetails,mutationDetails,registrationDetails
   } from "./applyResourceMutation/mutationDetails";
   import {
    transferorSummary,transferorInstitutionSummary
  } from "./summaryResource/transferorSummary";
import { propertyDetails } from "./applyResource/propertyDetails";
import { propertyLocationDetails } from "./applyResource/propertyLocationDetails";

import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import {
  sampleSearch,
  sampleSingleSearch,
  sampleDocUpload
} from "../../../../ui-utils/sampleResponses";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareDocumentsUploadData,
  getSearchResults,
  furnishNocResponse,
  setApplicationNumberBox
} from "../../../../ui-utils/commons";
import { propertySummary } from "./summaryResource/propertySummary";
import { transfereeSummary } from "./summaryResource/transfereeSummary";
import { registrationSummary } from "./summaryResource/registrationSummary";
import { declarationSummary } from "./summaryResource/declarationSummary";

import { documentsSummary } from "./summaryResource/documentsSummary";
import { mutationSummary } from "./applyResourceMutation/mutationSummary";
import {documentDetails} from "./applyResourceMutation/mutationDocuments";
import {transfereeDetails} from './applyResourceMutation/transfereeDetails'
export const stepsData = [
  { labelName: "Transfer Details", labelKey: "PT_MUTATION_TRANSFER_DETAILS" },
  { labelName: "Document Upload", labelKey: "PT_MUTATION_DOCUMENT_UPLOAD" },
  { labelName: "Summary", labelKey: "PT_MUTATION_SUMMARY" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

const applicationNumberContainer = () => {
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  if (applicationNumber)
    return {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-pt",
      componentPath: "ApplicationNoContainer",
      props: {
        number: `${applicationNumber}`,
        visibility: "hidden"
      },
      visible: true
    };
  else return {};
};

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Transfer of Ownership (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "PT_MUTATION_TRANSFER_HEADER"
  }),
  //applicationNumber: applicationNumberContainer()
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pt",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA",
      label: {
        labelValue: "Application No.",
        labelKey: "PT_MUTATION_APPLICATION_NO"
    }
    },
    visible: false
  }
});



export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    transferorDetails,
    transfereeDetails,
    mutationDetails,
    registrationDetails
  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    documentDetails:documentDetails
  },
  visible: false
};

export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children:{
    summary:getCommonCard({  
      transferorSummary: transferorSummary,
      // transferorInstitutionSummary:transferorInstitutionSummary,
      transfereeSummary: transfereeSummary,
      // transfereeInstitutionSummary: transfereeInstitutionSummary,
      mutationSummary:mutationSummary,
      registrationSummary:registrationSummary,
      documentsSummary: documentsSummary ,
      declarationSummary:declarationSummary
    }),
 
  },
  
  visible: false
};


const getMdmsData = async (action, state, dispatch) => {
  let tenantId =
    get(
      state.screenConfiguration.preparedFinalObject,
      "FireNOCs[0].fireNOCDetails.propertyDetails.address.city"
    ) || getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }]
        },
        {
          moduleName: "firenoc",
          masterDetails: [{ name: "BuildingType" }, { name: "FireStations" }]
        },
        {
          moduleName: "egov-location",
          masterDetails: [
            {
              name: "TenantBoundary"
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
        },
        { moduleName: "FireNoc", masterDetails: [{ name: "Documents" }] }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const getFirstListFromDotSeparated = list => {
  list = list.map(item => {
    if (item.active) {
      return item.code.split(".")[0];
    }
  });
  list = [...new Set(list)].map(item => {
    return { code: item };
  });
  return list;
};

const setCardsIfMultipleBuildings = (state, dispatch) => {
  if (
    get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.noOfBuildings"
    ) === "MULTIPLE"
  ) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer",
        "props.style",
        { display: "none" }
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.multipleBuildingContainer",
        "props.style",
        {}
      )
    );
  }
};

export const prepareEditFlow = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  const buildings = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
    []
  );
  if (applicationNumber && buildings.length == 0) {
    let response = await getSearchResults([
      {
        key: "tenantId",
        value: tenantId
      },
      { key: "applicationNumber", value: applicationNumber }
    ]);
    // let response = sampleSingleSearch();

    response = furnishNocResponse(response);

    dispatch(prepareFinalObject("FireNOCs", get(response, "FireNOCs", [])));
    if (applicationNumber) {
      setApplicationNumberBox(state, dispatch, applicationNumber);
    }
    // Set no of buildings radiobutton and eventually the cards
    let noOfBuildings =
      get(response, "FireNOCs[0].fireNOCDetails.noOfBuildings", "SINGLE") ===
      "MULTIPLE"
        ? "MULTIPLE"
        : "SINGLE";
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingRadioGroup",
        "props.value",
        noOfBuildings
      )
    );

    // Set no of buildings radiobutton and eventually the cards
    let nocType =
      get(response, "FireNOCs[0].fireNOCDetails.fireNOCType", "NEW") === "NEW"
        ? "NEW"
        : "PROVISIONAL";
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.nocRadioGroup",
        "props.value",
        nocType
      )
    );

    // setCardsIfMultipleBuildings(state, dispatch);

    // Set sample docs upload
    // dispatch(prepareFinalObject("documentsUploadRedux", sampleDocUpload()));
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const step = getQueryArg(window.location.href, "step");

    //Set Module Name
    set(state, "screenConfiguration.moduleName", "pt-mutation");

    // Set MDMS Data
    getMdmsData(action, state, dispatch).then(response => {
      // Set Dropdowns Data
      let buildingUsageTypeData = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.firenoc.BuildingType",
        []
      );
      buildingUsageTypeData = getFirstListFromDotSeparated(
        buildingUsageTypeData
      );
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.DropdownsData.BuildingUsageType",
          buildingUsageTypeData
        )
      );
      let ownershipCategory = get(
        state,
        "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.OwnerShipCategory",
        []
      );
      ownershipCategory = getFirstListFromDotSeparated(ownershipCategory);
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.DropdownsData.OwnershipCategory",
          ownershipCategory
        )
      );

      // Set Documents Data (TEMP)
      prepareDocumentsUploadData(state, dispatch);
    });

    // Search in case of EDIT flow
    prepareEditFlow(state, dispatch, applicationNumber, tenantId);

    // // Set Property City
    // dispatch(prepareFinalObject("FireNOCs[0].fireNOCDetails.propertyDetails.address.city", getTenantId()));

    // // Handle dependent dropdowns in edit flow
    // set(
    //   "apply",
    //   "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.children.singleBuilding.children.cardContent.children.singleBuildingCard.children.buildingSubUsageType",
    //   { display: "none" }
    // );

    // let pfo = {};
    // if (applicationNumber && !step) {
    //   pfo = searchSampleResponse();
    //   dispatch(prepareFinalObject("FireNOCs[0]", get(pfo, "FireNOCs[0]")));
    // }
    // if (step && get(state, "screenConfiguration.preparedFinalObject")) {
    //   pfo = get(
    //     state,
    //     "screenConfiguration.preparedFinalObject.FireNOCs[0]",
    //     {}
    //   );
    // }

    // Code to goto a specific step through URL
    if (step && step.match(/^\d+$/)) {
      let intStep = parseInt(step);
      set(
        action.screenConfig,
        "components.div.children.stepper.props.activeStep",
        intStep
      );
      let formWizardNames = [
        "formwizardFirstStep",
        "formwizardSecondStep",
        "formwizardThirdStep"
      ];
      for (let i = 0; i < 4; i++) {
        set(
          action.screenConfig,
          `components.div.children.${formWizardNames[i]}.visible`,
          i == step
        );
        set(
          action.screenConfig,
          `components.div.children.footer.children.previousButton.visible`,
          step != 0
        );
      }
    }

    // Set defaultValues of radiobuttons and selectors
    let noOfBuildings = get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.noOfBuildings",
      "SINGLE"
    );
    set(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.noOfBuildings",
      noOfBuildings
    );
    let nocType = get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.fireNOCType",
      "PROVISIONAL"
    );
    set(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.fireNOCType",
      nocType
    );

    // Preset multi-cards (CASE WHEN DATA PRE-LOADED)
    if (
      get(
        state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.noOfBuildings"
      ) === "MULTIPLE"
    ) {
      set(
        action.screenConfig,
        "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.singleBuildingContainer.props.style",
        { display: "none" }
      );
      set(
        action.screenConfig,
        "components.div.children.formwizardSecondStep.children.propertyDetails.children.cardContent.children.propertyDetailsConatiner.children.buildingDataCard.children.multipleBuildingContainer.props.style",
        {}
      );
    }
    if (
      get(
        state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.fireNOCType"
      ) === "PROVISIONAL"
    ) {
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.nocDetails.children.cardContent.children.nocDetailsContainer.children.provisionalNocNumber.props.style",
        { visibility: "hidden" }
      );
    }
    // if (
    //   get(
    //     state,
    //     "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.applicantDetails.ownerShipType",
    //     ""
    //   ).includes("MULTIPLEOWNERS")
    // ) {
    //   set(
    //     action.screenConfig,
    //     "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer.props.style",
    //     { display: "none" }
    //   );
    //   set(
    //     action.screenConfig,
    //     "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.multipleApplicantContainer.props.style",
    //     {}
    //   );
    // } else if (
    //   get(
    //     state,
    //     "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.applicantDetails.ownerShipType",
    //     ""
    //   ).includes("INSTITUTIONAL")
    // ) {
    //   set(
    //     action.screenConfig,
    //     "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.singleApplicantContainer.props.style",
    //     { display: "none" }
    //   );
    //   set(
    //     action.screenConfig,
    //     "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.institutionContainer.props.style",
    //     {}
    //   );
    //   set(
    //     action.screenConfig,
    //     "components.div.children.formwizardThirdStep.children.applicantDetails.children.cardContent.children.applicantTypeContainer.children.applicantSubType.props.style",
    //     {}
    //   );
    // }
    set(
      action.screenConfig,
      "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.propertySummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action.screenConfig,
      "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.transferorSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
 
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        footer
      }
    }
  }
};

export default screenConfig;
