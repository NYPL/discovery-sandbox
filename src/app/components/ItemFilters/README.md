### variable conventions
field - category of filter, ie location, format, status
option - selection within that category, encompassing both label and value
label - human readable label for the option
value - the query param that the API expects for that option

### Data shapes
fieldToOptionsMap - object
```
 {field: {label: value, anotherLabel: anotherValue},
 field2: {label: value}
 }
```

selectedFields - object
```
{field: [value, value, value],
field2: [],
field3: [value]}
```

### Important functions to understand
getLabelsForValues - takes an array of field option value strings and the field they belong to and returns an array of corresponding labels