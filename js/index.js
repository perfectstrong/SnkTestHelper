/**
 * Represents a line of test. Consists of a source (src) 
 * and its translation (dest).
 * 
 * @class Line
 */
class Line {
    /**
     * Creates an instance of Line.
     * @param {String} src text in source language
     * @param {String} dest translated text
     * @memberof Line
     */
    constructor(src, dest) {
        this.src = src;
        this.dest = dest;
    }

    /**
     * Dress the line in HTML
     * 
     * @returns {HTMLDivElement} a div containing 2 textarea
     */
    getHTML() {
        let div = document.createElement("div");
        div.classList += "line form-inline";

        // Src
        let txtSrc = document.createElement("textarea");
        txtSrc.setAttribute("rows", 3);
        txtSrc.value = this.src;
        txtSrc.classList += "src form-control";
        div.appendChild(txtSrc);

        // Control buttons
        let crtlButtons = document.createElement("div");
        crtlButtons.classList += "control-buttons";
        div.appendChild(crtlButtons);
        // TODO

        // Dest
        let txtDest = document.createElement("textarea");
        txtDest.setAttribute("rows", 3);
        txtDest.value = this.dest;
        txtDest.classList += "dest form-control";
        div.appendChild(txtDest);

        return div;
    }
}

/* Test maker */
$("#test-maker").submit(function (ev) {
    ev.preventDefault();
    var $this = $(this),
        inputtext = $this.find("#input-text"),
        tabletest = $this.find("#table-test");
    // Flush old content
    tabletest.empty();
    // Get the input text from form
    var srctext = "";
    srctext += inputtext.find("input#title").val() + "\n";
    srctext += inputtext.find("textarea#fulltext").val();
    // Parse srctext
    var arraySrctext = srctext.split(/\n/);
    // Make the table from fulltext
    var tableData = arraySrctext.map(src => new Line(src, ""));
    tableData.forEach(line => {
        tabletest.append(line.getHTML());
    });
})