import React, { useState } from "react";
import {
 ArrowForward,
 ArrowVectorDown,
 ArrowDirection,
 HomeIcon,
 ComplaintIcon,
 BPAHomeIcon,
 CollectionIcon,
 FinanceChartIcon,
 CollectionsBookmarIcons,
 DropIcon,
 DocumentIconSolid,
 PersonIcon,
 PropertyHouse,
 ReceiptIcon,
 CaseIcon,
} from "@mcd89/finance-ui-react-components";
import ReactTooltip from "react-tooltip";
import { set } from "lodash";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


const DIGIT_UI_CONTEXTS = [
 "digit-ui",
 "works-ui",
 "finance-ui",
 "health-ui",
 "sanitation-ui",
 "core-ui",
 "microplan-ui",
 "pucar-ui",
 "selco-ui",
 "mgramseva-web",
];


// Function to recursively get the key of a nested object based on a parent key
const getKey = (obj, parent) => {
 if (typeof obj !== "object" || obj === null) {
   // If obj is not an object or is null, return null
   return null;
 }
 // Use Object.keys to get an array of keys in the object
 const key = Object.keys(obj).map((key) => {
   // Check if the object has an 'item' property with a 'path' property
   if (typeof obj[key]?.item?.path === "string") {
     return (
       obj[key]?.item?.path?.split(parent ? `${parent}.${key}` : `.${key}`) ||
       getKey(obj[key], key)
     );
   }
   return null; // or return some default value if neither condition is met
 });
 // Return the first element of the array (the key)
 return key?.[0];
};


// Function to find the last key in a dot-separated key string
const findKey = (key = "") => {
 // Split the key string into an array using dot as a separator
 const newSplitedList = key?.split(".");
 // Check if the key string ends with a dot
 return key?.endsWith?.(".")
   ? // If it ends with a dot, return the first element of the array
   newSplitedList[0]
   : // If not, return the last element of the array
   newSplitedList[newSplitedList?.length - 1];
};


/*
Used to navigate to other mission's ui if user has access
*/
const navigateToRespectiveURL = (history = {}, url = "") => {
 if (url?.indexOf(`/${window?.contextPath}`) === -1) {
   const hostUrl = window.location.origin;
   const updatedURL = DIGIT_UI_CONTEXTS?.every(
     (e) => url?.indexOf(`/${e}`) === -1
   )
     ? hostUrl + "/digit-ui/employee/" + url
     : hostUrl + url;
   window.location.href = updatedURL;
 } else {
   history.push(url);
 }
};


const Sidebar = ({ data }) => {
 const { t } = useTranslation();
 const history = useHistory();
 const [openItems, setOpenItems] = useState({});
 const [selectedParent, setSelectedParent] = useState(null);
 const [selectedChild, setSelectedChild] = useState(null);
 const [selectedChildLevelOne, setSelectedChildLevelOne] = useState(null);


 const [subNav, setSubNav] = useState(false);


 const IconsObject = {
   home: <HomeIcon />,
   announcement: <ComplaintIcon />,
   business: <BPAHomeIcon />,
   store: <PropertyHouse />,
   assignment: <CaseIcon />,
   receipt: <ReceiptIcon />,
   "business-center": <PersonIcon />,
   description: <DocumentIconSolid />,
   "water-tap": <DropIcon />,
   "collections-bookmark": <CollectionsBookmarIcons />,
   "insert-chart": <FinanceChartIcon />,
   edcr: <CollectionIcon />,
   collections: <CollectionIcon />,
 };


 const toggleSidebar = (key) => {
   setOpenItems((prevOpenItems) => ({
     ...prevOpenItems,
     [key]: !prevOpenItems[key],
   }));
 };


 const openSidebar = () => {
   setSubNav(true);
 };
 const closeSidebar = () => {
   setSubNav(false);
   setOpenItems({});
   setSelectedParent(null);
   setSelectedChild(null);
   setSelectedChildLevelOne(null);
 };


 function extractLeftIcon(data = {}) {
   for (const key in data) {
     const item = data[key];


     if (key === "item" && item?.leftIcon !== "") {
       return {
         iconKey: item?.leftIcon?.split(":")?.[0],
         iconName: item?.leftIcon?.split(":")?.[1],
       };
     }


     if (typeof data[key] === "object" && !Array.isArray(data[key])) {
       const subResult = extractLeftIcon(data[key]);
       if (subResult) {
         return subResult; // Return as soon as a non-empty leftIcon is found
       }
     }
   }


   return null; // Return null if no non-empty leftIcon is found
 }
 const renderSidebarItems = (
   items,
   parentKey = null,
   flag = true,
   level = 0
 ) => {
   if (!items) return null;


   const keysArray = Object.keys(items).sort((a, b) => a.localeCompare(b));


   return (
     <div className={`submenu-container level-${level}`}>
       {keysArray.map((key, index) => {
         const subItems = items[key];
         const hasSubItems = subItems && typeof subItems === "object" && !subItems.item;
         const isSubItemOpen = openItems[key] || false;
         const itemKey = parentKey ? `${parentKey}.${key}` : key;
         const getModuleName = key?.replace(/[ -]/g, "_");
         const appendTranslate = t(
           Digit.Utils.locale.getTransformedLocale(
             `ACTION_TEST_${getModuleName}`
           )
         );
         const trimModuleName = appendTranslate?.length > 20
           ? appendTranslate.substring(0, 20) + "..."
           : appendTranslate;


         if (hasSubItems) {
           // If the item has sub-items, render a dropdown
           const { iconKey, iconName } = extractLeftIcon(subItems) || {};
           let leftIcon =
             IconsObject[iconName] || IconsObject.collections;
           if (iconKey === "dynamic") {
             const IconComp = require("@mcd89/finance-ui-react-components")?.[iconName];
             leftIcon = IconComp ? <IconComp /> : leftIcon;
           }
           if (iconKey === "svg") {
             const IconComp = require("@mcd89/finance-ui-react-components")?.SVG?.[iconName];
             leftIcon = IconComp ? <IconComp fill="white" /> : leftIcon;
           }


           const isParentActive = selectedParent === itemKey;
           const isChildActive = selectedChildLevelOne === trimModuleName;


           return (
             <div
               key={index}
               className={`sidebar-link level-${level} ${isParentActive ? "select-level" : ""
                 }`}
               style={{
                 display: "flex",
                 flexDirection: "column",
                 alignItems: "flex-start",
               }}
             >
               <div
                 className={`actions ${isChildActive && level === 1
                   ? "selected-action-level-1"
                   : isParentActive
                     ? `default-${level} active`
                     : `default-${level}`
                   }`}
                 onClick={(e) => {
                   toggleSidebar(key);
                   setSelectedParent((prevItem) => {
                     if (prevItem === itemKey) {
                       return null;
                     } else return itemKey;
                   });
                   const itemToHighlight = e.target.innerText;
                   setSelectedChildLevelOne((prevItem) => {
                     if (prevItem === itemToHighlight || isSubItemOpen) {
                       return null;
                     } else return itemToHighlight;
                   });
                   setSelectedChild(null);
                 }}
                 style={{
                   display: "flex",
                   flexDirection: "row",
                   width: "100%",
                 }}
               >
                 {flag && <div className="link-icon">{leftIcon}</div>}
                 <div data-tip="React-tooltip" data-for={`jk-side-${key}`}>
                   <span> {trimModuleName} </span>
                   {trimModuleName?.includes("...") && (
                     <ReactTooltip
                       textColor="white"
                       backgroundColor="grey"
                       place="right"
                       type="info"
                       effect="solid"
                       id={`jk-side-${key}`}
                     >
                       {t(
                         Digit.Utils.locale.getTransformedLocale(
                           `ACTION_TEST_${key}`
                         )
                       )}
                     </ReactTooltip>
                   )}
                 </div>
                 <div
                   style={{ position: "relative", marginLeft: "auto" }}
                   className={`arrow ${isSubItemOpen && subNav ? "open" : ""} ${isChildActive && level === 1 ? "selected-arrow" : ""
                     }`}
                 >
                   {isSubItemOpen ? (
                     <ArrowVectorDown height="28px" width="28px" />
                   ) : (
                     <ArrowForward />
                   )}
                 </div>
               </div>
               {subNav && isSubItemOpen && (
                 <div style={{ width: "100%" }}>
                   {renderSidebarItems(subItems, itemKey, false, level + 1)}
                 </div>
               )}
             </div>
           );
         } else if (subItems?.item) {
           // If it's a leaf node with an item
           const { iconKey, iconName } = extractLeftIcon(subItems) || {};
           let leftIcon =
             IconsObject[iconName] || IconsObject.collections;
           if (iconKey === "dynamic") {
             const IconComp = require("@mcd89/finance-ui-react-components")?.[iconName];
             leftIcon = IconComp ? <IconComp /> : leftIcon;
           }
           if (iconKey === "svg") {
             const IconComp = require("@mcd89/finance-ui-react-components")?.SVG?.[iconName];
             leftIcon = IconComp ? <IconComp fill="white" /> : leftIcon;
           }


           const isChildActive = selectedChild === subItems.item.path;


           return (
             <div
               key={index}
               className={`dropdown-link new-dropdown-link ${isChildActive ? "active" : ""
                 } level-${level}`}
               onClick={() => {
                 setSelectedParent(parentKey);
                 setSelectedChild(subItems.item.path);
                 setSelectedChildLevelOne(null);
                 navigateToRespectiveURL(
                   history,
                   `${subItems?.item?.navigationURL}`
                 );
               }}
             >
               <div
                 className={`actions level-${level} ${trimModuleName === "Home" ? "custom" : ""
                   }`}
                 data-tip="React-tooltip"
                 data-for={`jk-side-${key}`}
               >
                 {flag && <div className="link-icon">{leftIcon}</div>}
                 <span> {trimModuleName} </span>
                 {trimModuleName?.includes("...") && (
                   <ReactTooltip
                     textColor="white"
                     backgroundColor="grey"
                     place="right"
                     type="info"
                     effect="solid"
                     id={`jk-side-${key}`}
                   >
                     {t(
                       Digit.Utils.locale.getTransformedLocale(
                         `ACTION_TEST_${key}`
                       )
                     )}
                   </ReactTooltip>
                 )}
               </div>
             </div>
           );
         }
         return null;
       })}
     </div>
   );
 };


 return (
   <div
     className={`new-sidebar ${openItems ? "show" : ""}`}
     onMouseEnter={openSidebar}
     onMouseLeave={closeSidebar}
   >
     {renderSidebarItems(data)}
   </div>
 );
};


export default Sidebar;