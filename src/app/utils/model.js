import {
  isArray as _isArray,
  map as _map,
  contains as _contains,
  isEmpty as _isEmpty,
} from 'underscore';

function ModelEbsco() {
  /**
   * build(data)
   * @param (Array) data
   */
  this.build = data => {
    const ebscoData = {};

     // Make sure there's an input.
    if (!data || _isEmpty(data)) {
      return ebscoData;
    }

    ebscoData.request = this.getRequestData(data.SearchRequest);
    ebscoData.results = this.getResultData(data.SearchResult);
    ebscoData.databases = this.getDatabases(data.SearchResult);
    ebscoData.totalHits = this.getTotalHits(data.SearchResult);
    ebscoData.dateRange = this.getDateRange(data.SearchResult);
    ebscoData.facets = this.getFacets(data.SearchResult);

    return ebscoData;
  };

  /**
   * getRequestData(data)
   *
   * @param (object) data
   */
  this.getRequestData = data => {
    const request = {};

    return request;
  };

  /**
   * getResultData(data)
   *
   * @param (object) data
   */
  this.getResultData = data => {
    let results = [];

    if (!_isEmpty(data.Data) && data.Data.Records.length) {
      results = _map(data.Data.Records, record => {
        return record;
      });
    }

    return results;
  };

  /**
   * getDatabases(data)
   *
   * @param (object) data
   */
  this.getDatabases = data => {
    if (_isEmpty(data)) return [];
    let databases = [];

    if (data.Statistics && data.Statistics.Databases) {
      databases = _map(data.Statistics.Databases, dbs => {
        return {
          hits: dbs.Hits,
          id: dbs.Id,
          label: dbs.Label,
        };
      });
    }

    return databases;
  };

  /**
   * getTotalHits(data)
   *
   * @param (object) data
   */
  this.getTotalHits = data => {
    return data.Statistics.TotalHits;
  };

  /**
   * getDateRange(data)
   *
   * @param (object) data
   */
  this.getDateRange = data => {
    let result = {};

    try {
      const {
        AvailableCriteria: {
          DateRange: {
            MaxDate: max = '',
            MinDate: min = '',
          },
        },
      } = data;

      result = {
        max,
        min,
      };
    } catch (e) {
      result = {};
    }

    return result;
  };

  /**
   * getFacets(data)
   *
   * @param (object) data
   */
  this.getFacets = data => {
    let facets = [];

    if (data.AvailableFacets.length) {
      facets = _map(data.AvailableFacets, f => {
        return {
          id: f.Id,
          label: f.Label,
          values: f.AvailableFacetValues,
        };
      });
    }

    return facets;
  };

}

export default new ModelEbsco;
