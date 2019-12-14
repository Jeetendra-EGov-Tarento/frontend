import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "ui-redux/store";
import { getTranslatedLabel } from "../ui-config/screens/specs/utils";

import { mockJson } from './seacrMockJson';

const handleDeletedCards = (jsonObject, jsonPath, key) => {
  let originalArray = get(jsonObject, jsonPath, []);
  let modifiedArray = originalArray.filter(element => {
    return element.hasOwnProperty(key) || !element.hasOwnProperty("isDeleted");
  });
  modifiedArray = modifiedArray.map(element => {
    if (element.hasOwnProperty("isDeleted")) {
      element["isActive"] = false;
    }
    return element;
  });
  set(jsonObject, jsonPath, modifiedArray);
};

export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return label;
    } else {
      return translatedLabel;
    }
  } else {
    return label;
  }
};

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};

export const getSearchResults = async (queryObject, dispatch) => {
  try {
    store.dispatch(toggleSpinner());
    const response = "";
    //  await httpRequest(
      // "post",
      // "/firenoc-services/v1/_search",
      // "",
      // queryObject
    // );
    store.dispatch(toggleSpinner());
    return mockJson;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};

export const createUpdateNocApplication = async (state, dispatch, status) => {
  let nocId = get(
    state,
    "screenConfiguration.preparedFinalObject.BPAs[0].id"
  );
  let method = nocId ? "UPDATE" : "CREATE";

  try {
    let payload = get(
      state.screenConfiguration.preparedFinalObject,
      "BPA",
      []
    );
    let tenantId = get(
      state.screenConfiguration.preparedFinalObject,
      "citiesByModule.citizenTenantId",
      getTenantId()
    );
    // set(payload[0], "tenantId", tenantId);
    // set(payload[0], "fireNOCDetails.action", status);
    payload.tenantId = tenantId;

    // Get uploaded documents from redux
    let reduxDocuments = get(
      state,
      "screenConfiguration.preparedFinalObject.documentDetailsUploadRedux",
      {}
    );
    handleDeletedCards(
      payload[0],
      "BPA.owners",
      "id"
    );

    // Set owners & other documents
    let ownerDocuments = [];
    let otherDocuments = [];
    jp.query(reduxDocuments, "$.*").forEach(doc => {
      if (doc.documents && doc.documents.length > 0) {
        if (doc.documentType === "OWNER") {
          ownerDocuments = [
            ...ownerDocuments,
            {
              tenantId: tenantId,
              documentType: doc.documentSubCode
                ? doc.documentSubCode
                : doc.documentCode,
              fileStoreId: doc.documents[0].fileStoreId
            }
          ];
        } else if (!doc.documentSubCode) {
          // SKIP BUILDING PLAN DOCS
          otherDocuments = [
            ...otherDocuments,
            {
              tenantId: tenantId,
              documentType: doc.documentCode,
              fileStoreId: doc.documents[0].fileStoreId
            }
          ];
        }
      }
    });

    set(
      payload[0],
      "BPA.additionalDetail.documents",
      ownerDocuments
    );
    set(
      payload[0],
      "BPA.additionalDetail.documents",
      otherDocuments
    );

    // Set Channel and Financial Year
    process.env.REACT_APP_NAME === "Citizen"
      ? set(payload[0], "bpaDetails.channel", "CITIZEN")
      : set(payload[0], "bpaDetails.channel", "COUNTER");
    set(payload[0], "bpaDetails.financialYear", "2019-20");

    // Set Dates to Epoch
    let owners = get(payload[0], "BPA.owners", []);
    owners.forEach((owner, index) => {
      set(
        payload[0],
        `BPA.owners[${index}].dob`,
        convertDateToEpoch(get(owner, "dob"))
      );
    });

    let response;
    if (method === "CREATE") {
      // response = await httpRequest(
      //   "post",
      //   "/bpa/appl/_create",
      //   "",
      //   [],
      //   { BPA : payload }
      // );
      // response = furnishNocResponse(response);
      // dispatch(prepareFinalObject("BPA", response.BPA));
      // setApplicationNumberBox(state, dispatch);
    } else if (method === "UPDATE") {
      response = await httpRequest(
        "post",
        "/bpa/appl/_update",
        "",
        [],
        { BPA: payload }
      );
      response = furnishNocResponse(response);
      dispatch(prepareFinalObject("BPA", response.BPA));
    }
    return { status: "success", message: response };
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));

    // Revert the changed pfo in case of request failure
    let fireNocData = get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs",
      []
    );
    fireNocData = furnishNocResponse({ FireNOCs: fireNocData });
    dispatch(prepareFinalObject("FireNOCs", fireNocData.FireNOCs));

    return { status: "failure", message: error };
  }
};

export const prepareDocumentsUploadData = (state, dispatch) => {
  let documents = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.DocTypeMapping[0].docTypes",
    []
  );
  let documentsDropDownValues = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.DocumentType",
    []
  );

  let documentsList = [];
  documents.forEach(doc => {
    let code = doc.code.split(".")[0];
    doc.dropDownValues = [];
    documentsDropDownValues.forEach(value => {
      if (code === value.code.split(".")[0]) {
        doc.hasDropdown = true;
        doc.dropDownValues.push(value);
      }
    });
    documentsList.push(doc);
  });
  documents = documentsList;

  // documents = documents.filter(item => {
  //   return item.active;
  // });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = 'Documents',//doc.documentType;
    card["title"] = 'Documents',//doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    let card = {};
    card["name"] = doc.code;
    card["code"] = doc.code;
    card["required"] = doc.required ? true : false;
    if (doc.hasDropdown && doc.dropDownValues) {
      let dropDownValues = {};
      dropDownValues.label = "Select Documents";
      dropDownValues.required = doc.required;
      dropDownValues.menu = doc.dropDownValues.filter(item => {
        return item.active;
      });
      dropDownValues.menu = dropDownValues.menu.map(item => {
        return { code: item.code, label: getTransformedLocale(item.code) };
      });
      card["dropDownValues"] = dropDownValues;
    }
    tempDoc[doc.documentType].cards.push(card);
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });
  dispatch(prepareFinalObject("documentsContract", documentsContract));
};

export const prepareNOCUploadData = (state, dispatch) => {
  return;
  let documents = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.NOC",
    []
  );
  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
    // Handle the case for multiple muildings
    if (
      doc.code === "BUILDING.BUILDING_PLAN" &&
      doc.hasMultipleRows &&
      doc.options
    ) {
      let buildingsData = get(
        state,
        "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
        []
      );

      buildingsData.forEach(building => {
        let card = {};
        card["name"] = building.name;
        card["code"] = doc.code;
        card["hasSubCards"] = true;
        card["subCards"] = [];
        doc.options.forEach(subDoc => {
          let subCard = {};
          subCard["name"] = subDoc.code;
          subCard["required"] = subDoc.required ? true : false;
          card.subCards.push(subCard);
        });
        tempDoc[doc.documentType].cards.push(card);
      });
    } else {
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.natureOfNoc) {
        let natureOfNoc = {};
        natureOfNoc.label = "Nature Of Noc";
        natureOfNoc.required = true;
        natureOfNoc.menu = doc.natureOfNoc.filter(item => {
          return item.active;
        });
        natureOfNoc.menu = natureOfNoc.menu.map(item => {
          return { code: item.code, label: getTransformedLocale(item.code) };
        });
        card["natureOfNoc"] = natureOfNoc;
      }
      if (doc.hasDropdown && doc.remarks) {
        let remarks = {};
        remarks.label = "Remarks";
        remarks.required = true;
        remarks.menu = doc.remarks.filter(item => {
          return item.active;
        });
        remarks.menu = remarks.menu.map(item => {
          return { code: item.code, label: getTransformedLocale(item.code) };
        });
        card["remarks"] = remarks;
      }
      tempDoc[doc.documentType].cards.push(card);
    }
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("nocDocumentsContract", documentsContract));
};

export const furnishNocResponse = response => {
  // Handle applicant ownership dependent dropdowns
  let ownershipType = get(
    response,
    "FireNOCs[0].fireNOCDetails.applicantDetails.ownerShipType"
  );
  set(
    response,
    "FireNOCs[0].fireNOCDetails.applicantDetails.ownerShipMajorType",
    ownershipType == undefined ? "SINGLE" : ownershipType.split(".")[0]
  );

  // Prepare UOMS and Usage Type Dropdowns in required format
  let buildings = get(response, "FireNOCs[0].fireNOCDetails.buildings", []);
  buildings.forEach((building, index) => {
    let uoms = get(building, "uoms", []);
    let uomMap = {};
    uoms.forEach(uom => {
      uomMap[uom.code] = `${uom.value}`;
    });
    set(
      response,
      `FireNOCs[0].fireNOCDetails.buildings[${index}].uomsMap`,
      uomMap
    );

    let usageType = get(building, "usageType");
    set(
      response,
      `FireNOCs[0].fireNOCDetails.buildings[${index}].usageTypeMajor`,
      usageType == undefined ? "" : usageType.split(".")[0]
    );
  });

  return response;
};

export const setApplicationNumberBox = (state, dispatch, applicationNo) => {
  if (!applicationNo) {
    applicationNo = get(
      state,
      "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.applicationNumber",
      null
    );
  }

  if (applicationNo) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "props.number",
        applicationNo
      )
    );
  }
};
