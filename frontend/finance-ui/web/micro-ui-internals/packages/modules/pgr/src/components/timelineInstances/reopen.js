import { GreyOutText } from "@mcd89/finance-ui-react-components";
import React from "react";
const Reopen = ({ text, reopenDate }) => {
  // let { t } = useTranslation();
  // let reopenDate = ConvertTimestampToDate(obj.auditDetails.createdTime);
  return (
    <React.Fragment>
      {text}
      <p>{reopenDate}</p>
    </React.Fragment>
  );
};

export default Reopen;
