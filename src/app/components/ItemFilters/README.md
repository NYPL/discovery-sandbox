### variable conventions
field - category of filter, ie location, format, status
option - selection within that category, encompassing both label and value
label - human readable label for the option
value - the query param that the API expects for that option
filter - as much as possible, this word is only used to represent the combination of fields and selected options

### Data shapes
fieldToOptionsMap - object
convenience map generated to simplify switching from value to label. does not contain information about the number
of each aggregation.
```
 {
  field: {label: value, anotherLabel: anotherValue},
  field2: {label: value}
 }
```

selectedFields - object
```
{
  field: [value, value, value],
  field2: [],
  field3: [value]
}
```

reducedItemAggregations - array
generated from the item aggregations array from the api response. created to combine separate offsite options into one.
also contains the specific counts of each aggregation
```
[
  {@id: 'res:field',
  type: 'aggregation'
  id: 'field',
  options: [{ value: 'apireadable', label: 'humanreadable'}, 
            { value: 'anothervalue', label: 'anotherlabel'}]
  }
  values: the difference between options and values is that values has separate objects for different offsite codes, whereas options combines them into one string so the filter only renders one option for the label offsite. values shouldnt be read after generating options.
]
```
### Important functions to understand
getLabelsForValues - takes an array of field option value strings and the field they belong to and returns an array of corresponding labels