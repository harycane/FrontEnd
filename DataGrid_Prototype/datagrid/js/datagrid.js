/**
 * Created by HaryKrishnan Ramasubramanian (Andrew ID: hramasub) on 4/18/17.
 */
"use strict";
/*
 Constructor to initialize the instance variables with the object content.
 */

let DataGrid = function (gridObject) {

    this.data = gridObject.data.map(a => Object.assign({},a));
    this.columns = gridObject.columns.map(a => Object.assign({},a));
    this.rootElement = gridObject.rootElement;
    this.pageSize = gridObject.pageSize;
    if(this.pageSize !== undefined) {
        if (this.pageSize < this.data.length) {
            this.totalPages = Math.ceil(this.data.length / this.pageSize);
            this.currentPage = 1;
        }
    }
    this.onRender = gridObject.onRender;
    this.prevSort = this.columns[0].dataName;
    this.sortColumnAsc(this.prevSort);

    this.getTable();


};

//--------------------------------------------------------------------------------

/*
Destroy Method to remove all the tables.
*/


DataGrid.prototype.destroy = function() {

   if(typeof this.rootElement !== undefined) {
       this.rootElement.innerHTML ="";
   }
};

//--------------------------------------------------------------------------------

/*
Sorting method to sort numbers and strings of a column in Ascending Order.
 */
DataGrid.prototype.sortColumnAsc = function(prop) {
    this.prevSort = prop;

    this.data.sort(
        function (a,b) {
            if(typeof a[prop] === 'string') {
                return a[prop].localeCompare(b[prop]);
            }
            if(typeof a[prop] === 'number') {
                return a[prop] - b[prop];
            }



        }
    );


};

//--------------------------------------------------------------------------------
/*
Sorting toggle method to reverse the sort order.
 */

DataGrid.prototype.sortColumnToggle = function() {
    this.data.reverse();

};


//--------------------------------------------------------------------------------
/*
Sort Listner that hands the sort event and calls the appropriate sort method.
 */
DataGrid.prototype.sortListener = function (event) {

        if (typeof(event.target) !== 'undefined' && event.target.getAttribute("name") !== this.prevSort) {
            let col = event.target.getAttribute("name");
            this.sortColumnAsc(col);
        }
        else {
            this.sortColumnToggle();
        }

    this.getTable();


};
//--------------------------------------------------------------------------------

/*
Previous Listener that handles the previous page event.
 */
DataGrid.prototype.prevListener = function() {
        this.currentPage -= 1;
        this.getTable();

};
//--------------------------------------------------------------------------------

/*
Next Listener that handles the next page event.
 */
DataGrid.prototype.nextListener = function() {
        this.currentPage += 1;
        this.getTable();

};
//--------------------------------------------------------------------------------

/*
 getTable method to generate table dynamically using JavaScript.
 */
DataGrid.prototype.getTable =  function() {

    this.destroy();


    let table = document.createElement("table");
    this.rootElement.appendChild(table);


    /*
    Paging Logic.
     */
    if(this.pageSize !== undefined && this.pageSize < this.data.length) {

        let caption = document.createElement("CAPTION");
        table.appendChild(caption);
        let prev = document.createElement("span");
        caption.appendChild(prev);
        let span = document.createElement("span");
        caption.appendChild(span);
        let next = document.createElement("span");
        caption.appendChild(next);
        caption.style.textAlign = "right";

        prev.innerHTML = "<- Previous ";
        prev.setAttribute("class", "pre");
        span.innerHTML = this.currentPage + " of " + this.totalPages;
        next.innerHTML = " Next ->";
        next.setAttribute("class", "nxt");

        if(this.currentPage > 1) {
            prev.style.color = "blue";
            prev.disabled = false;
            prev.addEventListener("click", this.prevListener.bind(this),false);

        }
        else {
            prev.disabled = true;
            prev.setAttribute("class", "dimmed");

        }

        if(this.currentPage  < this.totalPages) {
            next.style.color = "blue";
            next.disabled = false;
            next.addEventListener("click", this.nextListener.bind(this),false);

        }
        else {
            next.disabled = true;
            next.setAttribute("class", "dimmed");

        }

    }


  /*
   onRender method called whenever the table is rendered, sorted or paged.
   */
  if(this.onRender !== undefined) {
        this.onRender();
    }



        let tHead = document.createElement("tHead");
        table.appendChild(tHead);

        let tr = document.createElement("tr");
        tHead.appendChild(tr);

        for (let i = 0; i < this.columns.length; i++) {

            let th = document.createElement("th");
            tr.appendChild(th);

            th.innerHTML = this.columns[i].name;
            th.setAttribute("align", this.columns[i].align);
            th.setAttribute("name", this.columns[i].dataName);
            th.setAttribute("title", "Sort by " + this.columns[i].name);

            th.addEventListener("click", this.sortListener.bind(this), false);

        }
    let tBody = document.createElement("tBody");
    table.appendChild(tBody);

    let first = 0;
    let last = this.data.length;

    if(this.pageSize !== undefined && this.pageSize < this.data.length) {
         first = (this.currentPage - 1) * this.pageSize;
         if (this.currentPage * this.pageSize < this.data.length) {
             last = this.currentPage * this.pageSize;
         } else {
             last = this.data.length;
         }
    }
    for (let j = first; j < last; j++) {

            let tr = document.createElement("tr");
            tBody.appendChild(tr);

            for(let k = 0; k < this.columns.length; k++) {

                let td = document.createElement("td");
                tr.appendChild(td);

                td.innerHTML = this.data[j][this.columns[k].dataName];
                td.style.textAlign = this.columns[k].align;
                td.setAttribute("name", this.columns[k].dataName);
                if(this.prevSort === this.columns[k].dataName) {
                    td.setAttribute("class", "sorted");
                }
            }

        }

    };

//--------------------------------------------------------------------------------

