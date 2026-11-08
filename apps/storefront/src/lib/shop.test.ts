import { describe, expect, it } from "vitest";
import { PAGE_SIZE, pageHref, sortProducts } from "./shop";

describe("sortProducts", () => {
  const p = (title: string, minPrice: number | null) => ({ title, minPrice });

  it("sorts by price ascending with missing prices last", () => {
    const sorted = sortProducts([p("a", 80), p("b", null), p("c", 50)], "price-asc");
    expect(sorted.map((item) => item.title)).toEqual(["c", "a", "b"]);
  });

  it("sorts by price descending with missing prices last", () => {
    const sorted = sortProducts([p("a", 80), p("b", null), p("c", 50)], "price-desc");
    expect(sorted.map((item) => item.title)).toEqual(["a", "c", "b"]);
  });

  it("sorts by name", () => {
    const sorted = sortProducts([p("Cumin", 10), p("Almond", 20), p("Black Pepper", 30)], "name");
    expect(sorted.map((item) => item.title)).toEqual(["Almond", "Black Pepper", "Cumin"]);
  });

  it("keeps the catalogue order for featured", () => {
    const sorted = sortProducts([p("Cumin", 10), p("Almond", 20)], "featured");
    expect(sorted.map((item) => item.title)).toEqual(["Cumin", "Almond"]);
  });

  it("does not mutate the input", () => {
    const input = [p("b", 20), p("a", 10)];
    sortProducts(input, "name");
    expect(input.map((item) => item.title)).toEqual(["b", "a"]);
  });
});

describe("pageHref", () => {
  it("keeps the query, category and sort and adds the page", () => {
    expect(
      pageHref({ query: "chili", categoryHandle: "seeds", sort: "price-asc" }, 2)
    ).toBe("/shop?q=chili&category=seeds&sort=price-asc&page=2");
  });

  it("omits the page on page one", () => {
    expect(pageHref({ query: "", categoryHandle: null, sort: "featured" }, 1)).toBe("/shop");
  });

  it("keeps the category when the page changes", () => {
    expect(
      pageHref({ query: "", categoryHandle: "whole-spices", sort: "featured" }, 3)
    ).toBe("/shop?category=whole-spices&page=3");
  });
});

describe("PAGE_SIZE", () => {
  it("pages the ledger at 24 products", () => {
    expect(PAGE_SIZE).toBe(24);
  });
});
