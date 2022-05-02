/* eslint-env mocha */
import React from "react";
import { expect } from "chai";
import { shallow, mount } from "enzyme";

import Sorter from "../../src/app/components/Sorter/Sorter";

describe("Sorter", () => {
  describe("html", () => {
    let component;
    before(() => {
      component = mount(
        <Sorter
          sortOptions={[
            { val: "val1", label: "label1" },
            { val: "val2", label: "label2" },
            { val: "val3", label: "label3" },
          ]}
          page={1}
          sortBy={"val1"}
        />
      );
    });

    it("should have a div with class nypl-results-sorting-controls", () => {
      const div = component.find("div");
      expect(div.length).to.equal(3);
      expect(div.at(0).hasClass("nypl-results-sorting-controls")).to.equal(
        true
      );
    });

    it("should have a div with class nypl-results-sorter page", () => {
      expect(
        component.find("div").at(1).hasClass("nypl-results-sorter 1")
      ).to.equal(true);
    });

    it("should have a div with nypl-select-field-results", () => {
      expect(
        component.find("div").at(2).hasClass("nypl-select-field-results")
      ).to.equal(true);
    });

    it("should have a label with appropriate htmlFor and text", () => {
      const label = component.find("label");
      expect(label.length).to.equal(1);
      expect(label.at(0).prop("htmlFor")).to.equal("sort-by-label");
      expect(label.at(0).text()).to.equal("Sort by");
    });

    it("should have a form", () => {
      expect(component.find("form").length).to.equal(1);
    });

    it("should have a span with className nypl-omni-fields", () => {
      const span = component.find("span");
      expect(span.length).to.equal(1);
      expect(span.at(0).hasClass("nypl-omni-fields")).to.equal(true);
    });

    it("should have a select", () => {
      const select = component.find("select");
      expect(select.length).to.equal(1);
    });

    it("select should have default sort value", () => {
      const select = component.find("select");
      expect(select.at(0).prop("value")).to.equal("val1");
    });

    it("should have options for each sort option", () => {
      const options = component.find("option");
      expect(options.length).to.equal(3);
      expect(options.at(0).prop("value")).to.equal("val1");
      expect(options.at(0).key()).to.equal("val1");
      expect(options.at(0).text()).to.equal("label1");
      expect(options.at(1).prop("value")).to.equal("val2");
      expect(options.at(1).key()).to.equal("val2");
      expect(options.at(1).text()).to.equal("label2");
      expect(options.at(2).prop("value")).to.equal("val3");
      expect(options.at(2).key()).to.equal("val3");
      expect(options.at(2).text()).to.equal("label3");
    });
  });

  describe("no-js", () => {
    // not sure the right way to test this
    it("should have a submit button");
  });

  describe("js", () => {
    const component = mount(
      <Sorter
        sortOptions={[
          { val: "val1", label: "label1" },
          { val: "val2", label: "label2" },
          { val: "val3", label: "label3" },
        ]}
        page={1}
        sortBy="val1"
      />
    );
    it("should not have a submit button", () => {
      const input = component.find("input");
      expect(input.length).to.equal(0);
    });

    // not sure the right way to test this
    it("should update sort value when a new option is selected");
  });
});
