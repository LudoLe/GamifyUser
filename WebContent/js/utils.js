export function showModal(title, content, cback = null) {
    $("#mainContainer").append(`<div class="modal" tabindex="-1" id="#mainModal">
	<div class="modal-dialog">
	  <div class="modal-content">
		<div class="modal-header">
		  <h5 class="modal-title">` +
        title +
        `</h5>
		  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		  </button>
		</div>
		<div class="modal-body">
		  <p>` +
        content +
        `</p>
		</div>
		<div class="modal-footer">
		  <button type="button" class="btn btn-outline-primary" data-dismiss="modal">Close</button>
		</div>
	  </div>
	</div>
  </div>`);
    $(".modal").modal("show");
    $(".modal").on("hidden.bs.modal", function () {
        document.getElementById("mainContainer").removeChild($(".modal")[0]);
        if (cback != null)
            cback();
    });
}
