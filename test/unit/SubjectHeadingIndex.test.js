/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from "react";
import { expect } from "chai";
import { mount, shallow } from "enzyme";

import SubjectHeadingsIndex from "@SubjectHeadingsIndex";
import { Heading } from "@nypl/design-system-react-components";
import SubjectHeadingsIndexPage from "./../../src/app/pages/SubjectHeadingsIndexPage";
import { mockRouterContext } from "../helpers/routing";

describe("SubjectHeadingsIndexPage", () => {
  let component;
  before(() => {
    component = shallow(
      <SubjectHeadingsIndexPage
        location={{
          search: "",
          query: {
            filter: "",
          },
        }}
      />
    );
  });
  it("should render `SubjectHeadingSearch`", () => {
    expect(component.find("SubjectHeadingSearch").length).to.equal(1);
  });

  describe("when filter is present", () => {
    before(() => {
      component = shallow(
        <SubjectHeadingsIndexPage
          location={{
            search: "",
            query: {
              filter: "Kermit the Frog",
            },
          }}
        />
      );
    });

    it("should have a heading announcing the filter", () => {
      expect(component.find(Heading).prop("children")).to.equal(
        'Subject Headings matching "Kermit the Frog"'
      );
    });
  });
});

describe("SubjectHeadingsIndex", () => {
  const context = mockRouterContext();
  let component;
  describe("Unfiltered index", () => {
    before(() => {
      component = mount(<SubjectHeadingsIndex />, { context });
    });
    it("should render `Alphabetical Pagination`", () => {
      expect(component.find("AlphabeticalPagination").length).to.equal(1);
    });
  });

  describe("Filtered index", () => {
    before(() => {
      context.router.location.query.filter = "pottery";
      component = mount(<SubjectHeadingsIndex />, { context });
    });
    after(() => {
      context.router.location.query.filter = undefined;
    });
    it("should not render `Alphabetical Pagination`", () => {
      expect(component.find("AlphabeticalPagination").length).to.equal(0);
    });
  });
});
