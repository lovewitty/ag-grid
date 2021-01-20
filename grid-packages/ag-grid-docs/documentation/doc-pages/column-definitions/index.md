---
title: "Column Definitions"
---
Each column in the grid is defined using a Column Definition (`ColDef`). Columns are positioned in the grid according to the order the Column Definitions are specified in the Grid Options.

The following example shows a simple grid with 3 columns defined:

<snippet>
const gridOptions = {
    // define 3 columns
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
    ]
}
</snippet>

See [Column Properties](../column-properties/) for a list of all properties that can be applied to a column.

If you want the columns to be grouped, you can include them as children like so:

<snippet suppressFrameworkContext=false>
const gridOptions = {
    // put the three columns into a group
    columnDefs: [
        {headerName: 'Group A', children: [
                { headerName: 'Athlete', field: 'athlete' },
                { headerName: 'Sport', field: 'sport' },
                { headerName: 'Age', field: 'age' },
            ]}
    ]
}
</snippet>

Groups are explained in more detail in the section [Column Groups](../column-groups/).

[[only-angular]]
| ## Declarative Columns
|
| You can define columns in two ways - either programatically (as shown above),
| or declare them via declaratively with markup.
|
| ### Column Definition
| ```js
| <ag-grid-column headerName="Name" field="name" [width]="150"></ag-grid-column>
| ```
|
| This example declares a simple Column Definition, specifying header name, field and width.
|
| ### Setting Column Properties
|
| There are some simple rules you should follow when setting column properties via Markup:
|
| ```js
| // string value
| propertyName="String Value"
| [propertyName]="'String Value'"
| [propertyName]="{{Interpolated Value}}"
| [propertyName]="functionCallReturningAString()"
|
| // boolean value
| [propertyName]="true|false"
| [propertyName]="{{Interpolated Value}}"
| [propertyName]="functionCallReturningABoolean()"
|
| // numeric value
| [propertyName]="Numeric Value"
| [propertyName]="functionCallReturningANumber()"
|
| // function value
| [propertyName]="functionName"
| [propertyName]="functionCallReturningAFunction()"
| ```
|
| ### Setting a Class or a Complex Value
|
| You can set a Class or a Complex property in the following way:
|
| ```ts
| // return a Class definition for a Filter
| [filter]="getSkillFilter()"
|
| private getSkillFilter(): any {
|     return SkillFilter;
| }
|
| // return an Object for filterParams
| [filterParams]="getCountryFilterParams()"
|
| private getCountryFilterParams():any {
|     return {
|         cellRenderer: this.countryCellRenderer,
|         cellHeight: 20
|     }
| }
| ```
|
| ### Grouped Column Definition
|
| To specify a Grouped Column, you can nest a column defintion:
|
| ```jsx
| <ag-grid-column headerName="IT Skills">
|     <ag-grid-column
|         headerName="Skills"
|         [width]="125"
|         [sortable]="false"
|         [cellRenderer]="skillsCellRenderer"
|         [filter]="getSkillFilter()">
|     </ag-grid-column>
|     <ag-grid-column
|         headerName="Proficiency"
|         field="proficiency"
|         [width]="120"
|         [cellRenderer]="percentCellRenderer"
|         [filter]="getProficiencyFilter()">
|     </ag-grid-column>
| </ag-grid-column>
| ```
|
| In this example we have a parent Column of "IT Skills", with two child columns.
|
| ## Example: Rich Grid using Markup
|
| The example below shows the same rich grid as the example above, but with configuration done via Markup.
|
| <grid-example title='Grid Customised for Accessibility' name='angular-rich-grid-markup' type='angular' options='{ "enterprise": true, "exampleHeight": 525, "showResult": true, "extras": ["fontawesome", "bootstrap"] }'></grid-example>

[[only-react]]
| ## Declarative Columns
|
| You can use the `AgGridColumn` element to declare your column definitions declaratively if you prefer.

[[only-vue]]
| ## Declarative Columns
|
| You can also define your grid column definition decoratively if you would prefer.
|
| You declare the grid as normal:
|
| ```jsx
| <ag-grid-vue
|         class="ag-theme-alpine"
|         style="width: 700px; height: 400px;"
|         :rowData="rowData"
|         //...rest of definition
| ```
|
| And within this component you can then define your column definitions:
|
| ```jsx
| <ag-grid-vue
|     //...rest of definition
| >
|     <ag-grid-column headerName="IT Skills">
|         <ag-grid-column
|             field="skills"
|             :width="120"
|             suppressSorting
|             cellRendererFramework="SkillsCellRenderer"
|             :menuTabs="['filterMenuTab']">
|         </ag-grid-column>
|         <ag-grid-column
|             field="proficiency"
|             :width="135"
|             cellRendererFramework="ProficiencyCellRenderer"
|             :menuTabs="['filterMenuTab']">
|         </ag-grid-column>
|     </ag-grid-column>
| </ag-grid-vue>
| ```
|
| In this example we're defining a grouped column with `IT Skills` having two
| child columns `Skills and Proficiency`.
|
| Not that anything other than a string value will need to be bound (i.e. `:width="120"`) as
| Vue will default to providing values as Strings.
|
| A full working example of defining a grid declaratively can be found in the
| [Vue Playground Repo](https://github.com/seanlandsman/ag-grid-vue-playground).

## Custom Column Types {#default-column-definitions}

In addition to the above, the grid provides additional ways to help simplify and avoid duplication of column definitions. This is done through the following:

- `defaultColDef`: contains properties that all columns will inherit.
- `defaultColGroupDef`: contains properties that all column groups will inherit.
- `columnTypes`: specific column types containing properties that column definitions can inherit.

Default columns and column types can specify any of the [column properties](../column-properties/) available on a column.

[[note]]
| Column Types are designed to work on Columns only, i.e. they won't be applied to Column Groups.

The following code snippet demonstrates these three properties:

[[only-javascript]]
| ```js
| const gridOptions = {
|     rowData: myRowData,
| 
|     // define columns
|     columnDefs: [
|         // uses the default column properties
|         { headerName: 'Col A', field: 'a'},
| 
|         // overrides the default with a number filter
|         { headerName: 'Col B', field: 'b', filter: 'agNumberColumnFilter' },
| 
|         // overrides the default using a column type
|         { headerName: 'Col C', field: 'c', type: 'nonEditableColumn' },
| 
|         // overrides the default using a multiple column types
|         { headerName: 'Col D', field: 'd', type: ['dateColumn', 'nonEditableColumn'] }
|     ],
| 
|     // a default column definition with properties that get applied to every column
|     defaultColDef: {
|         // set every column width
|         width: 100,
|         // make every column editable
|         editable: true,
|         // make every column use 'text' filter by default
|         filter: 'agTextColumnFilter'
|     },
| 
|     // if we had column groups, we could provide default group items here
|     defaultColGroupDef: {}
| 
|     // define a column type (you can define as many as you like)
|     columnTypes: {
|         'nonEditableColumn': { editable: false },
|         'dateColumn': {
|             filter: 'agDateColumnFilter',
|             filterParams: { comparator: myDateComparator },
|             suppressMenu: true
|         }
|     }
| 
|     // other grid options ...
| }
| ```

[[only-angular-or-vue]]
| ```js
| // define columns
| this.columnDefs = [
|     // uses the default column properties
|     { headerName: 'Col A', field: 'a'},
|     // overrides the default with a number filter
|     { headerName: 'Col B', field: 'b', filter: 'agNumberColumnFilter' },
|     // overrides the default using a column type
|     { headerName: 'Col C', field: 'c', type: 'nonEditableColumn' },
|     // overrides the default using a multiple column types
|     { headerName: 'Col D', field: 'd', type: ['dateColumn', 'nonEditableColumn'] }
| ];
|
| // a default column definition with properties that get applied to every column
| this.defaultColDef = {
|     // set every column width
|     width: 100,
|     // make every column editable
|     editable: true,
|     // make every column use 'text' filter by default
|     filter: 'agTextColumnFilter'
| };
|
| // if we had column groups, we could provide default group items here
| this.defaultColGroupDef = {};
|
| // define a column type (you can define as many as you like)
| this.columnTypes = {
|     'nonEditableColumn': { editable: false },
|     'dateColumn': {
|         filter: 'agDateColumnFilter',
|         filterParams: { comparator: myDateComparator },
|         suppressMenu: true
|     }
| };
| ```


[[only-react]]
| ```js
| <AgGridReact
|     defaultColDef={{
|         // set every column width 
|         width: 100,
|         // make every column editable
|         editable: true,
|         // make every column use 'text' filter by default
|         filter: 'agTextColumnFilter'
|     }}
|     
|     // if we had column groups, we could provide default group items here
|     defaultColGroupDef = {};
|     
|     // define a column type (you can define as many as you like)
|     columnTypes={{
|         'nonEditableColumn': { editable: false },
|         'dateColumn': {
|             filter: 'agDateColumnFilter',
|             filterParams: { comparator: myDateComparator },
|             suppressMenu: true,
|         }
|  
|     // other grid options ....
| >
|     // uses the default column properties
|     <AgGridColumn headerName='Col A' field='a' />
|
|     // overrides the default with a number filter
|     <AgGridColumn headerName='Col B' field='b' filter='agNumberColumnFilter' />
|
|     // overrides the default using a column type
|     <AgGridColumn headerName='Col C' field='c' type='nonEditableColumn' />
|
|     // overrides the default using a multiple column types
|     <AgGridColumn headerName='Col D' field='d' type={['dateColumn', 'nonEditableColumn']} />
| </AgGridReact>
| ```


When the grid creates a column it starts with the default column definition, then adds in anything from the column type, then finally adds in items from the specific column definition.

For example, the following is an outline of the steps used when creating 'Col C' shown above:

```js
// Step 1: the grid starts with an empty definition
{}

// Step 2: default column properties are merged in
{ width: 100, editable: true, filter: 'agTextColumnFilter' }

// Step 3: column type properties are merged in (using the 'type' property)
{ width: 100, editable: false, filter: 'agTextColumnFilter' }

// Step 4: finally column definition properties are merged in
{ headerName: 'Col C', field: 'c', width: 100, editable: false, filter: 'agTextColumnFilter' }
```

The following example demonstrates the different configuration properties in action.

<grid-example title="Column Definition Example" name="column-definition" type="generated"></grid-example>

## Right Aligned and Numeric Columns

The grid provides a handy shortcut for aligning columns to the right. Setting the column definition type to `rightAligned` aligns the column header and contents to the right, which makes the scanning of the data easier for the user.

[[note]]
| Because right alignment is used for numbers, we also provided an alias `numericColumn` that can be used to align the header and cell text to the right.

[[only-javascript]]
| ```js
| const gridOptions = {
|     columnDefs: [
|         { headerName: 'Column A', field: 'a' },
|         { headerName: 'Column B', field: 'b', type: 'rightAligned' },
|         { headerName: 'Column C', field: 'c', type: 'numericColumn' }
|     ]
| }
| ```

[[only-angular-or-vue]]
| ```js
| this.columnDefs = [
|     { headerName: 'Column A', field: 'a' },
|     { headerName: 'Column B', field: 'b', type: 'rightAligned' },
|     { headerName: 'Column C', field: 'c', type: 'numericColumn' }
| ]
| ```

[[only-react]]
| ```js
| <AgGridColumn headerName='Column A' field='a' />
| <AgGridColumn headerName='Column B' field='b' type='rightAligned' />
| <AgGridColumn headerName='Column C' field='c' type='numericColumn' />
| ```

## Column IDs

Each column generated by the grid is given a unique Column ID, which is used in parts of the Grid API.

If you are using the API and the columns IDs are a little complex (e.g. if two columns have the same `field`, or if you are using `valueGetter` instead of `field`) then it is useful to understand how columns IDs are generated.

If the user provides `colId` in the column definition, then this is used, otherwise the `field` is used. If both `colId` and `field` exist then `colId` gets preference. If neither `colId` nor `field` exists then a number is assigned. Finally, the ID is ensured to be unique by appending `'_n'` if necessary, where `n` is the first positive number that allows uniqueness.

In the example below, columns are set up to demonstrate the different ways IDs are generated. Open the example in a new tab and observe the output in the dev console. Note the following:

- Col 1 and Col 2 both use `colId`. The grid appends `'_1'` to Col 2 to make the ID unique.
- Col 3 and Col 4 both use `field`. The grid appends `'_1'` to Col 4 to make the ID unique.
- Col 5 and Col 6 have neither `colId` or `field` so the grid generates column IDs.

<grid-example title="Column IDs" name="column-ids" type="generated"></grid-example>