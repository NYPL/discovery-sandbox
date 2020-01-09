import QueryString from "querystring"

export default function useQuery(queryString) {
  const escapedString = queryString.replace('?', '')
  return QueryString.parse(escapedString)
}
