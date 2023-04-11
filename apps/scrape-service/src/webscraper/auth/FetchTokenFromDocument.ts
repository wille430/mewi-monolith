import axios from "axios";
import { load } from "cheerio";
import get from "lodash/get";

export interface IFetchAuthTokenStrategy {
  getToken(): any | Promise<any>;
}

export class FetchTokenFromDocument implements IFetchAuthTokenStrategy {
  private querySelector: string;
  private jsonPath: string | null;
  private url: string;

  constructor(
    url: string,
    jsonPath: string = null,
    querySelector = "#__NEXT_DATA__"
  ) {
    this.querySelector = querySelector;
    this.jsonPath = jsonPath;
    this.url = url;
  }

  public async getToken(): Promise<any> {
    const { data: html } = await axios.get(this.url);
    const $ = load(html);

    const text = $(this.querySelector).first().text();

    if (text == null) {
      throw new Error(
        `Could not scrape token from ${document.location.href}. Selector ${this.querySelector} might be missing`
      );
    }

    if (this.jsonPath == null) return text;

    return get(JSON.parse(text), this.jsonPath);
  }
}