<?php
$pageTitle = "Server-Side Row Model";
$pageDescription = "ag-Grid is a feature-rich datagrid available in Free or Enterprise versions. There are four available Row Models, the Server-Side Row Model is arguably the most powerful giving the ultimate 'big data' user experience. Users navigate through very large data sets using a mixture of server-side grouping and aggregation while using infinite scrolling to bring the data back in blocks to the client.";
$pageKeywords = "ag-Grid Server-Side Row Model";
$pageGroup = "row_models";
include '../documentation-main/documentation_header.php';
?>

<h1 class="heading-enterprise">Server-Side Row Model</h1>

<p class="lead">
    This section gives an overview of the Server-Side Row Model (SSRM) and provides guidance on when it should be used.
</p>

<? enterprise_feature("Server-Side Row Model"); ?>

<p>
    The Server-Side Row Model (SSRM) allows applications to work with very large datasets. This is done by
    lazy-loading data from the server via the following mechanisms:
</p>

<ol>
    <li>Lazy loading child records from group rows as group rows are expanded.</li>
    <li>Infinite scrolling through data, loading more data as the application scrolls.</li>
</ol>

<p>
    As a result operations such as sorting, filtering, grouping and pivoting can be delegated to the server.
</p>

<p>
    Using the SSRM to view a large dataset is demonstrated below:
</p>

<div class="animated-example">
    <img data-gifffer="server-side-showcase.gif" data-gifffer-width="99%" style="width: 100%; height: 100%" />
</div>

<p>
    Before diving into the details of how to use the SSRM, the next section provides an overview and
    explains when it should be used instead of the default <a href="/javascript-grid-client-side-model/">Client-Side Row Model</a>.
</p>

<h2>Overview</h2>

<p>
    When designing a grid-based application, one of the key considerations is how much data needs to be sent from
    the server to the client. The answer to this determines which Row Model should be selected for the grid.
</p>

<h3>Client-Side Row Model</h3>

<p>
    The simplest approach is to send all row data to the browser in response to a single request at initialisation.
    For this use case the <a href="/javascript-grid-client-side-model/">Client-Side Row Model</a> has been designed.
</p>

<p>
    This scenario is illustrated below where 10,000 records are loaded directly into the browser:
</p>

<p><img src="in-memory-row-model.png" alt="in-memory-row-model" width="90%" /></p>

<p>
    Once the data is loaded into the grid using the Client-Side Row Model, the grid can then do sorting, filtering,
    grouping etc. on the data inside the grid without requiring further assistance from the application.
</p>

<p>
    The Client-Side Row Model only renders the rows currently visible using
    <a href="../javascript-grid-dom-virtualisation/">DOM Virtualisation</a>, so the upper limit of rows is governed
    by the browser's memory footprint and data transfer time, rather than any restrictions inside the grid.
</p>

<h3>Server-Side Row Model</h3>

<p>
    However many real world applications contain much larger datasets, often involving millions of records. In this
    case it simply isn't feasible to load all the data into the browser in one go. Instead the data will need
    to be lazy-loaded as required and then purged to limit the memory footprint in the browser.
</p>

<p>
    This is precisely the problem the SSRM addresses, along with delegating server-side operations
    such as filtering, sorting, grouping and pivoting.
</p>

<p>
    The following diagram shows the approach used by the SSRM. Here there are 10 million records,
    however the number of records is only constrained by the limits of the server-side:
</p>

<p><img src="enterprise-row-model.png" alt="enterprise-row-model" width="90%" /></p>

<p>
    As the user performs operations such as expanding groups, the grid issues requests to the server for more data.
</p>

<h2>Features</h2>

<p>
    You may benefit from the combination of all these features or just be interested in a subset. The features of the
    SSRM are:
</p>

<ul class="content">
    <li>
        <b>Lazy-Loading of Groups:</b> The grid will load the top level rows only. Children
        of groups are only loaded when the user expands the group.
    </li>
    <li>
        <p>
            <b>Infinite Scrolling:</b> When active, rows are read back from the server in blocks to provide the experience
            of infinite scrolling. This allows viewing very large datasets in the browser by
            only bringing back data one block at a time.
        </p>
        <p>
            Using Infinite Scrolling is an optional feature. It is possible to bring back all the data for a particular
            group level and then allow the grid to do Sorting and Filtering of the data in the browsers memory.
        </p>
    </li>
    <li>
        <b>Server-Side Grouping, Pivot and Aggregation:</b> Because the data is coming back from the server one group
        level at a time, this allows you to do aggregation on the server, returning back the aggregated
        results for the top level parent rows. For example you could include 'employee count' as an attribute
        on the returned manager record, to say how many employees a manager manages.
    </li>
    <li>
        <b>Slice and Dice:</b> Assuming your server-side can build the data query, you can allow the user
        to use the Grid UI to drag columns around to select what columns you want to group by and aggregate
        on. What the user selects will then be forwarded to your datasource as part of the request. This feature
        is advanced and will require some difficult server-side coding from you, however when done
        your users will have an experience of slicing and dicing large data in real time, something previously
        only available in expensive reporting tools, which you can now embed into your JavaScript application.
    </li>
</ul>

<h2>Full Stack Examples</h2>

<p>
    All the examples in this documentation are standalone examples that can be run inside the documentation
    and exported to Plunker. This is excellent as you can easily inspect fully working examples. To allow this,
    all the examples have mocked servers (as the examples in the docs and Plunker are client-side only).
</p>

<p>
    To accompany the examples in the documentation, we also provide the following full stack examples for
    reference. We advise using the examples in the documentation to learn about the Server-Side Row Model
    and then using the full stack examples as reference.
</p>

<p>
    The full stack examples are as follows:
</p>

<ul>
    <li><a href="../nodejs-server-side-operations/">Node.js connecting to MySQL</a></li>
    <li><a href="../oracle-server-side-operations/">Java Server connecting to Oracle</a></li>
    <li><a href="../graphql-server-side-operations/">GraphQL connecting to MySQL</a></li>
    <li><a href="../spark-server-side-operations/">Java Server connecting to Apache Spark</a></li>
</ul>

<h2>Next Up</h2>

<p>
    To get started using the SSRM see the next section on: <a href="../javascript-grid-server-side-model-datasource/">Server-Side Datasource</a>.
</p>

<?php include '../documentation-main/documentation_footer.php';?>
