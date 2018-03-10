const datalineid = "data-line-id";

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
        this.id = -1; // Id will be regenerated when add to TableTest
    }

    /**
     * Dress the line in HTML
     * 
     * @returns {HTMLDivElement} a div containing 2 textarea
     */
    getHTML() {
        let div = document.createElement("div");
        div.classList += "line form-inline";
        div.setAttribute(datalineid, this.id);

        // Src
        let txtSrc = document.createElement("textarea");
        txtSrc.setAttribute("rows", 3);
        txtSrc.value = this.src;
        txtSrc.classList += "src form-control";
        div.appendChild(txtSrc);
        txtSrc.onkeyup = function updateSrc(ev) {
            // Regularly update content
            this.src = txtSrc.value;
        }

        // Control buttons
        div.appendChild(buildControlButtons(this));

        // Dest
        let txtDest = document.createElement("textarea");
        txtDest.setAttribute("rows", 3);
        txtDest.value = this.dest;
        txtDest.classList += "dest form-control";
        div.appendChild(txtDest);
        txtDest.onkeyup = function updateDest(ev) {
            // Regularly update content
            this.dest = txtDest.value;
        }

        return div;
    }
}
/**
 * Represents the test
 * 
 * @class TableTest
 */
class TableTest {
    /**
     * Creates an instance of TableTest.
     * @memberof TableTest
     */
    constructor() {
        this.data = [];
        // Other metadata
        this.metadata = {
            title: "", // Title of chosen text
            candidate: "", // SNK Nickname
            attempt: 0, // Number of attempts candidate has tried
            _testtittle: "", // Title of this test, calculated by rule
        }
        this.counter = 0;
    }

    generateId() {
        this.counter++;
        return this.counter;
    }

    /**
     * Add a new line at the end
     * 
     * @param {Line} line 
     * @memberof TableTest
     */
    push(line) {
        line.id = this.generateId();
        this.data.push(line);
    }

    /**
     * Add a new line at a specific index
     * 
     * @param {Number} index 
     * @param {Line} line not having ID. Otherwise, its ID will be reset
     * @memberof TableTest
     */
    insertAt(index, line) {
        line.id = this.generateId();
        this.data.splice(index, 0, line);
    }

    /**
     * Delete a line having specified id. Do nothing if not found
     * 
     * @param {Number} id 
     * @memberof TableTest
     */
    deleteLineHavingId(id) {
        let pos = this.data.findIndex(line => line.id == id);
        if (pos > -1) {
            this.data.splice(pos, 1);
        }
    }

    /**
     * Delete a line "equal" to value. Do nothing if not found
     * 
     * @param {Line} value 
     * @memberof TableTest
     */
    deleteLineEqualTo(value) {
        let pos = this.findIndexOfLineEqualTo(value);
        if (pos > -1) {
            this.data.splice(pos, 1);
        }
    }

    /**
     * Find the index of a line
     * 
     * @param {Line} content 
     * @returns {Number} -1 if not found
     * @memberof TableTest
     */
    findIndexOfLineEqualTo(content) {
        return this.data.findIndex(line => line.id == content.id
            && line.src == content.src
            && line.dest == content.dest
        );
    }

    /**
     * Find the index of the line having submitted value
     * 
     * @param {Number} id 
     * @returns {Number} -1 if not found
     * @memberof TableTest
     */
    findIndexOfLineHavingId(id) {
        return this.data.findIndex(line => line.id == id);
    }

    /**
     * Set the name of candidate
     * 
     * @param {String} name 
     * @memberof TableTest
     */
    setCandidate(name) {
        this.metadata.candidate = name.replace("_", " ");
    }

    /**
     * Set the name of chosen test
     * 
     * @param {String} name 
     * @memberof TableTest
     */
    setTitle(name) {
        this.metadata.title = name.replace("_", " ");
    }

    /**
     * Set the order of this test
     * 
     * @param {Number} num 
     * @memberof TableTest
     */
    setAttempt(num) {
        this.metadata.attempt = (num > 0 ? num : 1);
    }

    /**
     * 
     * 
     * @returns {String} the title of test according to rule
     * @memberof TableTest
     */
    getTestTitle() {
        if (!this.metadata._testtittle) {
            this.metadata._testtittle =
                "SNKTEST_" + this.metadata.candidate
                + "_" + this.metadata.title
                + "_" + this.metadata.attempt;
        }
        return this.metadata._testtittle;
    }

    /**
     * Initialize data from input text
     * 
     * @param {String} srctext including the title
     * @memberof TableTest
     */
    initFromText(srctext) {
        let self = this;
        srctext.split(/\n/)
            .forEach(linetext => self.push(new Line(linetext, "")));
    }

    /**
     * Initialize data from loaded json
     * 
     * @param {any} json 
     * @memberof TableTest
     */
    initFromJSON(json) {
        // TODO
    }

    /**
     * Dress the table in HTML
     * 
     * @returns {HTMLDivElement}
     * @memberof TableTest
     */
    getHTML() {
        // Outer HTML
        let div = document.createElement("div");
        div.id = "table-test";

        // Inner HTML
        // Test title
        let title = document.createElement("h3");
        title.innerHTML = this.getTestTitle();
        div.appendChild(title);
        // Test content
        this.data.forEach(line => div.appendChild(line.getHTML()));

        return div;
    }
}

/**
 * Some control buttons for a line
 * 
 * @returns {HTMLDivElement} a div containing glyph buttons
 */
function buildControlButtons() {
    let ctrlButtons = document.createElement("div");
    ctrlButtons.classList += "control-buttons";

    // Add new line
    let btnAdd = document.createElement("button");
    btnAdd.classList += "btn btn-primary glyphicon glyphicon-plus";
    btnAdd.setAttribute("data-toggle", "tooltip");
    btnAdd.setAttribute("title", "Thêm một dòng trống sau dòng này");
    ctrlButtons.appendChild(btnAdd);
    btnAdd.onclick = function appendNewLine(ev) {
        let lineDiv = $(ev.target).parent().parent(),
            lineID = lineDiv.attr(datalineid),
            pos = table.findIndexOfLineHavingId(lineID);
        if (pos > -1) {
            // Add data in table
            let newLine = new Line("", "");
            table.insertAt(pos + 1, newLine);
            // Add HTML
            lineDiv.after(newLine.getHTML());
        } else {
            // TODO
            // Set warning modal
        }
    };
    $(btnAdd).tooltip(); // Initialize bootstrap tooltip

    // Delete this line
    let btnDel = document.createElement("button");
    btnDel.classList += "btn btn-danger glyphicon glyphicon-remove";
    btnDel.setAttribute("data-toggle", "tooltip");
    btnDel.setAttribute("title", "Xóa dòng này");
    ctrlButtons.appendChild(btnDel);
    btnDel.onclick = function deleteThisLine(ev) {
        // TODO
        let lineDiv = $(ev.target).parent().parent(),
            lineID = lineDiv.attr(datalineid),
            pos = table.findIndexOfLineHavingId(lineID);
        if (pos > -1) {
            // Delete data in table
            table.deleteLineHavingId(lineID);
            // Delete HTML
            lineDiv.remove();
        } else {
            // TODO
            // Set warning modal
        }
    };
    $(btnDel).tooltip(); // Intialize boostrap tooltip

    return ctrlButtons;
}

let table = new TableTest(); // Data behind the table of test
let $maker = $("#test-maker"),
    $content = $("#test-content"),
    $saver = $("#test-saver"),
    $loader = $("#test-loader");

/* Test maker */
$maker.find("form#input-text").submit(function (ev) {
    ev.preventDefault();
    let $this = $(this);
    // Flush old content
    $content.find(".panel-body").empty();
    // Get metatdata
    table.setTitle($this.find("input#title").val());
    table.setCandidate($this.find("input#nickname").val());
    table.setAttempt($this.find("input#attempt").val());
    // Get the input text from form
    let srctext = "";
    srctext += $this.find("input#title").val() + "\n";
    srctext += $this.find("textarea#fulltext").val();
    // Init table's data
    table.initFromText(srctext);
    // Show the table
    $content.find(".panel-body").append(table.getHTML());
    // Announce success
    let success = document.createElement("p");
    success.classList += "text-success";
    success.innerHTML = "Đã tạo bài test. Mời bạn làm bài ở mục <a href='#test-content'>Làm bài</a>.";
    $this.after(success);
});