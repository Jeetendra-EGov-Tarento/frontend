const remoteComponentPath = (moduleName, path) => {
  let component = null;
  switch (moduleName) {
    case "egov-tradelicence":
      if (path === "ui-atoms-local") {
        component = import("egov-tradelicence/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-tradelicence/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-tradelicence/ui-containers-local");
      }
      break;
<<<<<<< HEAD
    case "egov-pt":
      if (path === "ui-atoms-local") {
        component = import("egov-pt/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-pt/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-pt/ui-containers-local");
      }
      break;
    case "egov-common":
      if (path === "ui-atoms-local") {
        component = import("egov-common/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-common/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-common/ui-containers-local");
      }
      break;
    case "egov-noc":
      if (path === "ui-atoms-local") {
        component = import("egov-noc/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-noc/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-noc/ui-containers-local");
=======
    case "egov-wns":
      if (path === "ui-atoms-local") {
        component = import("egov-wns/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-wns/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-wns/ui-containers-local");
>>>>>>> wms-phase-1
      }
      break;
    case "egov-uc":
      if (path === "ui-atoms-local") {
        component = import("egov-uc/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-uc/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-uc/ui-containers-local");
      }
      break;
    case "egov-abg":
      if (path === "ui-atoms-local") {
        component = import("egov-abg/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-abg/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-abg/ui-containers-local");
      }
      break;
    case "egov-bpa":
      if (path === "ui-atoms-local") {
        component = import("egov-bpa/ui-atoms-local");
      } else if (path === "ui-molecules-local") {
        component = import("egov-bpa/ui-molecules-local");
      } else if (path === "ui-containers-local") {
        component = import("egov-bpa/ui-containers-local");
      }
      break;
    default:
      break;
  }
  return component;
};

export default remoteComponentPath;
