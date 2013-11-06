  define(['aloha', 'aloha/plugin', 'jquery',  'jquery19', 'ui/ui', 'aloha/ephemera', 'block/block', 'block/blockmanager', 'underscore', 'PubSub'], 
  		function(Aloha, Plugin, jQuery,  jQuery19, UI, Ephemera, block, BlockManager, _, PubSub) {
  			var n = 0;

			 var SimpleTableBlock = block.AbstractBlock.extend({
				      title: 'SimpleTable',
				      isDraggable: function() {return false;},
				      init: function($element, postProcessFn) {			 

	                    jQuery($element).find('td').each(function() {
	                    	var $td = jQuery(this);
	                    	$td.wrapInner('<div class="aloha-editable"></div>');
	                    });

				      	return postProcessFn();
				      },
                      update: function($element, postProcessFn) {
	                    jQuery($element).find('td').each(function() {
	                    	var $td = jQuery(this);
	                    	if(!jQuery($td.children().get(0)).hasClass('aloha-editable')) {
	                    	$td.wrapInner('<div class="aloha-editable">&nbsp;</div>');

	                    	}
	                    });
	                    
	                    return postProcessFn();
				 	  }
			    });  	

			var updateValue = function() {
					 var $dropdown = jQuery19('.contentHeader ul.table-dropdown');
                     var cols = jQuery19('.cols-size', $dropdown).data('slider').getValue();                     
                     var rows = jQuery19('.rows-size', $dropdown).data('slider').getValue();

                     jQuery19('.rows-value', $dropdown).html(rows);
                     jQuery19('.cols-value', $dropdown).html(cols);
			}		

			var _initTables = function(editable) {
	  				var $tables = editable.obj.find('table');

					$tables.wrap('<div class="aloha-table"></div>').parent().alohaBlock({'aloha-block-type': 'SimpleTableBlock'});							
			}


  			return Plugin.create('simpletable', {
  				defaultSettings: {
  					enabled: true
  				}, 
		        init: function () {
		        	var self = this;

                    self.settings = jQuery.extend(true, self.defaultSettings, self.settings);			        	

		        	if(!self.settings.enabled) { return; }

				    Ephemera.attributes('data-aloha-block-type', 'contenteditable');
					
                    BlockManager.registerBlockType('SimpleTableBlock', SimpleTableBlock);

                    Aloha.bind('aloha-my-undo', function(event, args) {
                      _initTables(args.editable);
                    });

					Aloha.bind('aloha-editable-created', function($event, editable) {
						_initTables(editable);

  					    var $dropdown = jQuery19('.contentHeader ul.table-dropdown');

  					    if(editable.obj && editable.obj.attr('id') == 'contenteditor') {
  					    	jQuery19('li.createtable', $dropdown).on('click', function(e) { 
  					    		if(e.target.nodeName == 'BUTTON')
  					    			return true;
  					    		return false; 
  					    	});

                            jQuery19('.cols-size', $dropdown).slider().on('slide', function() {
                            	updateValue();
                            	return false;
			                });

                            jQuery19('.rows-size', $dropdown).slider().on('slide', function() {
                            	updateValue();
                            	return false;
                            });      

                            jQuery19('.deleterow', $dropdown).hover(function() {
		                      	var $tr, tds;

		                         editable = Aloha.activeEditable;
		                         range = Aloha.Selection.getRangeObject();

								 $tr= jQuery(range.startContainer).closest('tr');
								 $tr.addClass('to-delete');
                            }, function() {
		                      	var $tr, tds;

		                         editable = Aloha.activeEditable;
		                         range = Aloha.Selection.getRangeObject();

								 $tr= jQuery(range.startContainer).closest('table');
								 $tr.find('.to-delete').removeClass('to-delete');
                            })

                            jQuery19('.deletecolumn', $dropdown).hover(function() {
		                      	var $tr, $td, $table, tds;

		                         editable = Aloha.activeEditable;
		                         range = Aloha.Selection.getRangeObject();

								 $td = jQuery(range.startContainer).closest('td');
								 tds = 1+$td.index();
								 $table = $td.closest('table');

								 $table.find('tr').each(function() {
								 	$tr = jQuery(this);
								 	var $_tmp = $tr.find('td:nth-child('+tds+')');
								 	$_tmp.addClass('to-delete');
								 });

                            }, function() {
		                      	var $tr, tds;

		                         editable = Aloha.activeEditable;
		                         range = Aloha.Selection.getRangeObject();

								 $tr= jQuery(range.startContainer).closest('table');
								 $tr.find('.to-delete').removeClass('to-delete');
                            });

                            jQuery19('.insertrowbefore', $dropdown).hover(function() {
		                      	var $tr, tds;
		                      	var _isFirst = false;

		                         editable = Aloha.activeEditable;
		                         range = Aloha.Selection.getRangeObject();

							 	 $table = jQuery(range.startContainer).closest('table');
								 $tr= jQuery(range.startContainer).closest('tr');

								 if($tr.index() === 0) {
								 	_isFirst = true;
								 }

		                         tds = $tr.find('td').length;

		                         var $row = '';

		                         _(tds).times(function() {
		                         	$row += '<td>&nbsp;</td>';
		                         });

		                         if(_isFirst) {
			                         $table.prepend('<tr class="to-insert">'+$row+'</tr>');
		                         } else {
			                         $tr.before('<tr class="to-insert">'+$row+'</tr>');
		                         }

                            }, function() {
		                      	var $tr, tds;

		                         editable = Aloha.activeEditable;
		                         range = Aloha.Selection.getRangeObject();

								 $tr= jQuery(range.startContainer).closest('table');
								 $tr.find('.to-insert').remove();
                            });

                            jQuery19('.insertrowafter', $dropdown).hover(function() {
		                      	var $tr, tds;

		                         editable = Aloha.activeEditable;
		                         range = Aloha.Selection.getRangeObject();

								 $tr= jQuery(range.startContainer).closest('tr');

		                         tds = $tr.find('td').length;

		                         var $row = '';

		                         _(tds).times(function() {
		                         	$row += '<td>&nbsp;</td>';
		                         });

		                         $tr.after('<tr class="to-insert">'+$row+'</tr>');
                            }, function() {
		                      	var $tr, tds;

		                         editable = Aloha.activeEditable;
		                         range = Aloha.Selection.getRangeObject();

								 $tr= jQuery(range.startContainer).closest('table');
								 $tr.find('.to-insert').remove();
                            });

                            jQuery19('.insertcolumnafter', $dropdown).hover(function() {
		                      	var $tr, $td, $table, tds;

		                         editable = Aloha.activeEditable;
		                         range = Aloha.Selection.getRangeObject();

								 $td= jQuery(range.startContainer).closest('td');

								 $table = $td.closest('table');
								 var $block = BlockManager.getBlock($table.closest('.aloha-block-SimpleTableBlock'));

								 tds = 1+$td.index();

								 $table.find('tr').each(function() {
								 	var $t = jQuery(this);
								 	$t.find('td:nth-child('+tds+')').after('<td class="to-insert" style="width: 10px;">&nbsp;</td>');
								 });

                            }, function() {
		                      	var $tr, tds;

		                         editable = Aloha.activeEditable;
		                         range = Aloha.Selection.getRangeObject();

								 $tr= jQuery(range.startContainer).closest('table');
								 $tr.find('.to-insert').remove();
                            });

                            jQuery19('.insertcolumnbefore', $dropdown).hover(function() {
		                      	var $tr, $td, $table, tds;

		                         editable = Aloha.activeEditable;
		                         range = Aloha.Selection.getRangeObject();

								 $td= jQuery(range.startContainer).closest('td');

								 $table = $td.closest('table');
								 var $block = BlockManager.getBlock($table.closest('.aloha-block-SimpleTableBlock'));

								 tds = 1+$td.index();

								 $table.find('tr').each(function() {
								 	var $t = jQuery(this);
								 	$t.find('td:nth-child('+tds+')').before('<td class="to-insert" style="width: 10px;">&nbsp;</td>');
								 });
                            }, function() {
		                      	var $tr, tds;

		                         editable = Aloha.activeEditable;
		                         range = Aloha.Selection.getRangeObject();

								 $tr= jQuery(range.startContainer).closest('table');
								 $tr.find('.to-insert').remove();
                            });

                       }

					});

   	               PubSub.sub('aloha.selection.context-change', function(m){
   	               	  var $td = jQuery(m.range.startContainer).closest('td');
					  var $dropdown = jQuery19('.contentHeader ul.table-dropdown');

   	               	  if($td.length > 0) {
   	               	  	$dropdown.find('.inserttable').prop('disabled', 'disabled');
   	               	  	$dropdown.find('.deletetable').parent().removeClass('disabled');

   	               	  	$dropdown.find('.insertrowafter').parent().removeClass('disabled');
   	               	  	$dropdown.find('.insertrowbefore').parent().removeClass('disabled');
   	               	  	$dropdown.find('.insertcolumnafter').parent().removeClass('disabled');
   	               	  	$dropdown.find('.insertcolumnbefore').parent().removeClass('disabled');

   	               	  	$dropdown.find('.deleterow').parent().removeClass('disabled');
   	               	  	$dropdown.find('.deletecolumn').parent().removeClass('disabled');
   	               	  } else {
   	               	  	$dropdown.find('.inserttable').prop('disabled', '');
   	               	  	$dropdown.find('.deletetable').parent().addClass('disabled');

   	               	  	$dropdown.find('.insertrowafter').parent().addClass('disabled');   	               	  	
   	               	  	$dropdown.find('.insertrowbefore').parent().addClass('disabled');   	               	  	
   	               	  	$dropdown.find('.insertcolumnafter').parent().addClass('disabled');   	               	  	
   	               	  	$dropdown.find('.insertcolumnbefore').parent().addClass('disabled');   	               	  	

   	               	  	$dropdown.find('.deleterow').parent().addClass('disabled');   	               	  	
   	               	  	$dropdown.find('.deletecolumn').parent().addClass('disabled');   	               	  	   	               	  	
   	               	  }
   	               });


                   UI.adopt('inserttable', null, {
                      click: function() {        
                         editable = Aloha.activeEditable;
                         range = Aloha.Selection.getRangeObject();

    					 var $dropdown = jQuery19('.contentHeader ul.table-dropdown');
                         var cols = jQuery19('.cols-size', $dropdown).data('slider').getValue();
                         var rows = jQuery19('.rows-size', $dropdown).data('slider').getValue();

                         var html = '';
                         for(var i=0; i<rows; i++) {
                         	html += '<tr>';
                         	for(var j=0; j<cols; j++) {
                         		html += '<td>&nbsp;</td>';
                         	}
                         	html += '</tr>';
                         }
                         var $a = jQuery('<div class="aloha-table"><table><tbody>'+html+'</tbody></table></div>');
                         $a.alohaBlock({'aloha-block-type': 'SimpleTableBlock'});                       

                         GENTICS.Utils.Dom.insertIntoDOM($a, range, editable.obj);
                         
                         //range.select();
                         return true;
                      }
                    });

                   UI.adopt('deletetable', null, {
                      click: function() {        
                      	// TODO
                      	// Should ask user if this is possible

                      	var $tr, tds;

                         editable = Aloha.activeEditable;
                         range = Aloha.Selection.getRangeObject();

						 $tr= jQuery(range.startContainer).closest('tr');

						 var $block = BlockManager.getBlock($tr.closest('.aloha-block-SimpleTableBlock'));
						 $block.unblock();
 						 $tr.closest('.aloha-block-SimpleTableBlock').remove();
 						 return true;
                      }
                    });

                   UI.adopt('insertrowbefore', null, {
                      click: function() {        
                      	var $tr, tds;
                      	var _isFirst = false;

                         editable = Aloha.activeEditable;
                         range = Aloha.Selection.getRangeObject();

					 	 $table = jQuery(range.startContainer).closest('table');
						 $tr= jQuery(range.startContainer).closest('tr');

						 if($tr.index() === 0) {
						 	_isFirst = true;
						 }


						 var $block = BlockManager.getBlock($tr.closest('.aloha-block-SimpleTableBlock'));

                         tds = $tr.find('td').length;

                         var $row = '';

                         _(tds).times(function() {
                         	$row += '<td>&nbsp;</td>';
                         });

                         if(_isFirst) {
	                         $table.prepend('<tr>'+$row+'</tr>');
                         } else {
	                         $tr.before('<tr>'+$row+'</tr>');
                         }

                         $block.attr('one', n);                         
                         n += 1;

                         range.select();

                         return true;
                      }
                    });


                   UI.adopt('insertrowafter', null, {
                      click: function() {        
                      	var $tr, tds;

                         editable = Aloha.activeEditable;
                         range = Aloha.Selection.getRangeObject();

						 $tr= jQuery(range.startContainer).closest('tr');

						 var $block = BlockManager.getBlock($tr.closest('.aloha-block-SimpleTableBlock'));

                         tds = $tr.find('td').length;

                         var $row = '';

                         _(tds).times(function() {
                         	$row += '<td>&nbsp;</td>';
                         });

                         $tr.after('<tr>'+$row+'</tr>');

                         $block.attr('one', n);                         
                         n += 1;
                         range.select();

                         return true;
                      }
                    });

                   UI.adopt('insertcolumnafter', null, {
                      click: function() {        
                      	var $tr, $td, $table, tds;

                         editable = Aloha.activeEditable;
                         range = Aloha.Selection.getRangeObject();

						 $td= jQuery(range.startContainer).closest('td');

						 $table = $td.closest('table');
						 var $block = BlockManager.getBlock($table.closest('.aloha-block-SimpleTableBlock'));

						 tds = 1+$td.index();

						 $table.find('tr').each(function() {
						 	var $t = jQuery(this);
						 	$t.find('td:nth-child('+tds+')').after('<td>&nbsp;</td>');
						 });

                         $block.attr('one', n);                         
                         n += 1;
                         range.select();

                         return true;
                      }
                    });

                   UI.adopt('insertcolumnbefore', null, {
                      click: function() {        
                      	var $tr, $td, $table, tds;

                         editable = Aloha.activeEditable;
                         range = Aloha.Selection.getRangeObject();

						 $td= jQuery(range.startContainer).closest('td');

						 $table = $td.closest('table');
						 var $block = BlockManager.getBlock($table.closest('.aloha-block-SimpleTableBlock'));

						 tds = 1+$td.index();

						 $table.find('tr').each(function() {
						 	var $t = jQuery(this);
						 	$t.find('td:nth-child('+tds+')').before('<td>&nbsp;</td>');
						 });

                         $block.attr('one', n);                         
                         n += 1;
                         range.select();

                         return true;
                      }
                    });


                   UI.adopt('deleterow', null, {
                      click: function() {        
                      	var $tr, tds;

                         editable = Aloha.activeEditable;
                         range = Aloha.Selection.getRangeObject();

						 $tr= jQuery(range.startContainer).closest('tr');

						 $tr.remove();
                      }
                    });

                   UI.adopt('deletecolumn', null, {
                      click: function() {        
                      	var $tr, $td, $table, tds;

                         editable = Aloha.activeEditable;
                         range = Aloha.Selection.getRangeObject();

						 $td = jQuery(range.startContainer).closest('td');
						 tds = 1+$td.index();
						 $table = $td.closest('table');

						 $table.find('tr').each(function() {
						 	$tr = jQuery(this);
						 	var $_tmp = $tr.find('td:nth-child('+tds+')');
						 	$_tmp.remove();
						 });
                      }
                    });


		        },		        
  				makeClean: function(obj) {  					
                  jQuery(obj).find('.aloha-table').each(function() {
                  	var $block = jQuery(this);                  	
                  	var $table = jQuery($block.find('table').get(0));

                  	$block.replaceWith($table);

                  	$table.find('td').each(function() {
                  		var $td = jQuery(this);
                  		var $elems = $td.find('div').html();

                  		$td.html($elems);
                  	});

                  });
  				}
		    });

  		}
);