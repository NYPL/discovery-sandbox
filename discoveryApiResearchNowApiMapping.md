# Discovery API - ResearchNow API mapping
## Discovery API
[Github](https://github.com/NYPL-discovery/discovery-api/blob/master/README.md#searching)
### Parameters
[GET `/v0.1/discovery/resources`](https://platformdocs.nypl.org/#/discovery/get_v0_1_discovery_resources)
* `q` string
* `page` string
* `per_page` integer
* `sort` integer
 * 'relevance', 'title', 'creator', 'date'
* `sort_direction` string
 * 'asc', 'desc'
 * title defaults to asc, date defaults to desc, creator defaults to asc, relevance is fixed desc
* `search_scope` string
 * 'all', 'title', 'contributor', 'subject', 'series', 'callnumber', 'standard_number'
* `filters` string
 * 'owner’, 'subjectLiteral’, 'holdingLocation’, 'deliveryLocation’, 'language', 'materialType', 'mediaType’, 'carrierType’, 'publisher’, 'contributor’, 'creator’, 'issuance’, 'createdYear’, 'dateAfter', or 'dateBefore'
 * Specify a hash of filters to apply, where keys are from terms above

## ResearchNow API
[Github](https://github.com/NYPL/sfr-ingest-pipeline/tree/development/app/sfr-search-api#searching)
### Parameters
[GET `/v0.1/research-now/v3/search-api`](https://dev-platformdocs.nypl.org/#/research-now/get_v0_1_research_now_v3_search_api)
* **`field`** (required) string
 * Keyword, Title, Author, StandardNumber(ISBN, ISSN, LCCN and OCLC) and Subject
 * Defaults to Keyword
* **`query`** (required) string
* `recordType`
 * Internal record type to return with the work. Either instances or editions.
* `page` integer
* `per_page` integer
* `sort`
* `language`
* `years`
 * This should be formatted as {"start": year, "end": year}.

<style>
  table ul {
    list-style: none;
  }
</style>

## Comparison
|Discovery front end|Discovery API |ResearchNow API|
|-------------------|--------------|---------------|
|_Search field_     |`q`           |`query`        |
|_Search field dropdown_|`search_scope`|`field`|
|<ul>'All Fields'   |<ul>"all"     |<ul>"keyword"|
|<ul>'Title'            |<ul>"title"        |<ul>"title"       |
|<ul>'Author/Contributor'|<ul>"contributor" |<ul>"author"      |
|<ul>'Standard Number'|<ul>"standard_number"|<ul> 'standard_number'|
|_Search page filters_|`filters`     |`filters`      |
|<ul>'Format'       |<ul>"materialType"|<ul>_N/A_|
|<ul><li>'Date':<ul><li>'Start Year'<li>'End Year'| <ul><br>"dateAfter"<br>"dateBefore" |`years`:<ul>"start"<br>"end"|
|<ul>'Language'|<ul>"language"|<ul>`language`|
|_Filters linked to from a bib page_|
|<ul>'Author'|<ul>"creatorLiteral"|<ul>use `field` 'author'|
|<ul>'Additional Authors'|<ul>"creatorLiteral"|<ul>use `field` 'author'|
|<ul>'Subject'    |<ul>"subjectLiteral"|<ul>use `field` 'subject'|
|_Pagination_     |`page`      | `page`        |
|                   |`per_page`|`per_page`|
|Sorting            |`sort`        |`sort` "field" |
|                   |`sort_direction`|"direction"  |
