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
        txtSrc.onkeyup = _ => {
            // Regularly update content
            this.src = txtSrc.value;
        }

        // Control buttons
        div.appendChild(controlButtons(this));

        // Dest
        let txtDest = document.createElement("textarea");
        txtDest.setAttribute("rows", 3);
        txtDest.value = this.dest;
        txtDest.classList += "dest form-control";
        div.appendChild(txtDest);
        txtDest.onkeyup = _ => {
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
            nickname: "", // SNK Nickname
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
    setNickname(name) {
        this.metadata.nickname = name.replace("_", " ");
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
                "SNKTEST_" + this.metadata.nickname
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
     * @param {String} jsonstring a string in format of json
     * @memberof TableTest
     */
    initFromJSON(jsonstring) {
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

        // Test content
        this.data.forEach(line => div.appendChild(line.getHTML()));

        return div;
    }

    /**
     * In order to save into browser's memory
     * 
     * @returns {String} stringified version of this table
     * @memberof TableTest
     */
    JSONStringify() {
        return JSON.stringify(this);
    }

    /**
     * In order to create a html file
     * 
     * @see https://effectiveinc.com/effective-thinking/articles/generating-downloadable-word-document-browser/
     * 
     * @returns {HTMLHtmlElement} a basic table in html with a title
     * @memberof TableTest
     */
    getHTMLPage() {
        let html = document.createElement("html"),
            head = document.createElement("head"),
            body = document.createElement("body");
        html.appendChild(head);
        html.appendChild(body);

        // Set the header
        // Charset
        let charset = document.createElement("meta");
        head.appendChild(charset);
        charset.setAttribute("charset", "utf-8");
        // Title
        let title = document.createElement("title");
        head.appendChild(title);
        title.innerText = this.getTestTitle();
        // Style
        let style = document.createElement("style");
        head.appendChild(style);
        style.innerText = "table {border-collapse: collapse;}"
            + "table, td, tr {border: solid 1px black}"
            + "td {width: 50%}";

        // Set the body
        // Title
        let heading = document.createElement("h1");
        body.appendChild(heading);
        heading.innerText = this.metadata.title;
        heading.id = "testtitle";
        // Nickname
        body.appendChild(metadataBanner("nickname",
            "Nickname trên Sonako:",
            this.metadata.nickname));
        // Attempt
        body.appendChild(metadataBanner("attempt",
            "Lần test thứ:",
            this.metadata.attempt));
        // LN Title
        body.appendChild(metadataBanner("title",
            "Tiêu đề truyện:",
            this.metadata.title));
        // Calculate the table
        let content = document.createElement("table");
        body.appendChild(content);
        let tbody = document.createElement("tbody");
        content.appendChild(tbody);
        for (let index = 0; index < this.data.length; index++) {
            const line = this.data[index];

            let row = document.createElement("tr");
            tbody.appendChild(row);
            row.id = line.id;

            let srcTxt = document.createElement("td"),
                destTxt = document.createElement("td");
            row.appendChild(srcTxt);
            row.appendChild(destTxt);
            srcTxt.innerText = line.src;
            srcTxt.classList += "src";
            destTxt.innerText = line.dest;
            destTxt.classList += "dest";
        }

        return html;
    }

    /**
     * Check if the table has been set
     * 
     * @returns {Boolean} true if there is no line in data. False otherwise
     * @memberof TableTest
     */
    isEmpty() {
        if (this.data.length == 0) {
            return true;
        } else {
            return false;
        }
    }
}

/**
 * Some control buttons for a line
 * 
 * @returns {HTMLDivElement} a div containing glyph buttons
 */
function controlButtons() {
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
        let lineDiv = $(ev.target).parent().parent(),
            lineID = lineDiv.attr(datalineid),
            pos = table.findIndexOfLineHavingId(lineID);
        if (pos > -1) {
            // Delete data in table
            table.deleteLineHavingId(lineID);
            // Delete HTML
            lineDiv.remove();
        }
    };
    $(btnDel).tooltip(); // Intialize boostrap tooltip

    return ctrlButtons;
}

/**
 * Representation of a certain metadata
 * 
 * @param {String} id name of metadata
 * @param {String} label description
 * @param {String} value current value
 * @param {Boolean} editable 
 * @param {Function} onkeyuphandler 
 * @returns {HTMLParagraphElement} a paragraph representing a certain metadata
 */
function metadataBanner(id, label, value, editable, onkeyuphandler) {
    let p = document.createElement("p"),
        lbl = document.createElement("label"),
        val = document.createElement("span");
    p.appendChild(lbl);
    p.appendChild(val);
    lbl.innerText = label;
    lbl.setAttribute("for", id);
    val.innerText = value;
    val.setAttribute("id", id);
    if (editable) {
        val.setAttribute("contenteditable", editable);
        val.onkeyup = onkeyuphandler;
    }
    return p;
}

let table = new TableTest(); // Data behind the table of test
let $maker = $("#test-maker"),
    $content = $("#test-content"),
    $saver = $("#test-saver"),
    $loader = $("#test-loader");

/* Test maker */
$maker.find("form#input-text").submit(function initTableTest(ev) {
    ev.preventDefault();
    let $this = $(this),
        $makerStatus = $maker.find("[role=status]"),
        $contentStatus = $content.find("[role=status]"),
        $metadata = $content.find("#metadata");
    // Flush old content
    $makerStatus.removeClass();
    $makerStatus.html("");
    $contentStatus.removeClass();
    $contentStatus.html("");
    $metadata.removeClass();
    $metadata.html("");
    $content.find("#table-test").empty();
    // Get metatdata
    table.setTitle($this.find("input#title").val());
    table.setNickname($this.find("input#nickname").val());
    table.setAttempt($this.find("input#attempt").val());
    // Get the input text from form
    let srctext = $this.find("textarea#fulltext").val();
    // Init table's data
    table.initFromText(srctext);

    /* Show editable metadata */
    // Test title
    let title = document.createElement("h3");
    $metadata.append(title);
    title.innerText = table.getTestTitle();
    // Nickname
    $metadata.append(metadataBanner("nickname",
        "Nickname trên Sonako:",
        table.metadata.nickname,
        true,
        (ev) => { table.metadata.nickname = ev.target.innerText }));
    // Attempt
    $metadata.append(metadataBanner("attempt",
        "Lần test thứ:",
        table.metadata.attempt,
        true,
        (ev) => { table.metadata.attempt = ev.target.innerText }));
    // LN Title
    $metadata.append(metadataBanner("title",
        "Tiêu đề truyện:",
        table.metadata.title,
        true,
        (ev) => { table.metadata.title = ev.target.innerText }));
    // Show the table
    $content.find("#table-test").html(table.getHTML());
    // Announce success
    $makerStatus.addClass("text-success");
    $makerStatus.html("Đã tạo bài test. Mời bạn làm bài ở mục <a href='#test-content'>Làm bài</a>.");
    $contentStatus.addClass("text-success");
    $contentStatus.html("Đã tạo bài test. Bạn có thể sửa trực tiếp các thông tin liên quan bài test mà không cần tạo lại bài test.");
});

/* Test saver */
// Web storage
$saver.find("button#save-browser").click(function saveWebStorage(ev) {
    let $status = $saver.find("[role=status]");
    $status.removeClass();
    $status.html("");
    // Check if table is empty
    if (table.isEmpty()) {
        $status.addClass("text-warning");
        $status.html("Không có bài test nào đang mở!");
        return false;
    }
    // Check web storage
    if (typeof (Storage) == "undefined") {
        $status.addClass("text-danger");
        $status.html("Trình duyệt của bạn không hỗ trợ Web Storage.");
        return false;
    }
    // Normal run
    localStorage.setItem(table.getTestTitle(), table.JSONStringify());
    $status.addClass("text-success");
    $status.html("<p>Đã lưu với tên " + table.getTestTitle() + ".</p>");
    return true;
});
// HTML
$saver.find("button#save-html").click(function saveHTML(ev) {
    let $status = $saver.find("[role=status]");
    $status.removeClass();
    $status.html("");
    // Check if table is empty
    if (table.isEmpty()) {
        $status.addClass("text-warning");
        $status.html("Không có bài test nào đang mở!");
        return false;
    }
    // Normal run
    let link = document.createElement("a");
    link.download = table.getTestTitle() + ".html";
    link.href = "data:text/html," + encodeURIComponent(table.getHTMLPage().innerHTML);
    link.innerText = "đây";
    $status.addClass("text-success");
    $status.html("<p>Đã lưu. Bạn có thể tải tại " + link.outerHTML + ".</p>");
    return true;
});
// Doc
$saver.find("button#save-doc").click(function saveDoc() {
    let $status = $saver.find("[role=status]");
    $status.removeClass();
    $status.html("");
    // Check if table is empty
    if (table.isEmpty()) {
        $status.addClass("text-warning");
        $status.html("Không có bài test nào đang mở!");
        return false;
    }
    // Normal run
    let html = table.getHTMLPage();

    // Some attribute of html
    html.setAttribute("xmlns:office", "urn:schemas-microsoft-com:office:office");
    html.setAttribute("xmlns:word", "urn:schemas-microsoft-com:office:word");
    html.setAttribute("xmlns", "http://www.w3.org/TR/REC-html40");
    let head = html.getElementsByTagName("head")[0];
    let xml = document.createElement("xml");
    head.appendChild(xml);
    xml.innerHTML = "<word:WordDocument>" +
        "<word:View>Print</word:View>" +
        "<word:Zoom>90</word:Zoom>" +
        "<word:DoNotOptimizeForBrowser/>" +
        "</word:WordDocument>";
    let link = document.createElement("a");
    link.download = table.getTestTitle() + ".doc";
    link.innerText = "đây";
    link.href = URL.createObjectURL(new Blob([html.outerHTML], { type: "text/html" }));
    $status.addClass("text-success");
    $status.html("<p>Đã lưu. Bạn có thể tải tại " + link.outerHTML + ".</p>");
});