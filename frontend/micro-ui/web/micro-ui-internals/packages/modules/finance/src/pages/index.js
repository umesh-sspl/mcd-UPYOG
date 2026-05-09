/**
 * Created By : Umesh Kumar
 * Created On : 13-05-2025
 * Purpose : FinanceApp component for routing
 */

import { PrivateRoute } from "@nudmcdgnpm/digit-ui-react-components";

import React from "react";

import { useTranslation } from "react-i18next";

import {
  Link,
  Switch,
  useLocation
} from "react-router-dom";

import FinanceIframe from "../components/FinanceIframe";

const FinanceApp = ({ path }) => {

  const { t } = useTranslation();

  const location = useLocation();

  const mobileView =
    window.innerWidth <= 640;

  return (

    <Switch>

      <React.Fragment>

        <div className="ground-container">

          {/* Breadcrumb */}

          <p
            className="breadcrumb"
            style={{
              marginLeft:
                mobileView
                  ? "1vw"
                  : "15px"
            }}
          >

            <Link
              to="/digit-ui/employee"
              style={{
                cursor: "pointer",
                color: "#666"
              }}
            >
              {t("Home")}
            </Link>

            {" / "}

            <span>
              {t("Finance")}
            </span>

          </p>

          {/* Inbox */}

          <PrivateRoute
            exact
            path={`${path}/inbox`}
            component={() => <FinanceIframe />}
          />

          {/* Dashboard */}

          <PrivateRoute
            exact
            path={`${path}/dashboard`}
            component={() => <FinanceIframe />}
          />

          {/* Home */}

          <PrivateRoute
            exact
            path={`${path}/home`}
            component={() => <FinanceIframe />}
          />

          {/* Dynamic Routes */}

          <PrivateRoute
            path={`${path}`}
            component={() => <FinanceIframe />}
          />

        </div>

      </React.Fragment>

    </Switch>
  );
};

export default FinanceApp;