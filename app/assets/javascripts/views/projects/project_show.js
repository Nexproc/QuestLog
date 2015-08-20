Nexproc.Views.ProjectShow = Backbone.CompositeView.extend({
  template: JST['main_content'],
  className: "panel panel-default",
  templateOptions: {
    list: "tasks",
    button: JST['delete_project']()
  },

  initialize: function (options) {
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model.tasks(), 'add', this.addTaskView);
    this.addChildren();
  },

  preRender: function () {
    var head = "<a>" + this.model.escape('name') + "</a>";
    this.templateOptions.header = head
  },

  events: {
    // 'click .view-members' : 'show_members',
    'click .add-task': "new_task",
    'click .panel-title a' : 'showPage',
    'click .delete-project': "delete_project"
  },

  showPage: function (e) {
    e.preventDefault();
    var url = Backbone.history.fragment + "/tasks";
    Backbone.history.navigate(url, { trigger: true });
  },

  new_task: function () {
    var form = new Nexproc.Views.TaskForm({
      project: this.model,
      model: new Nexproc.Models.Task(),
      collection: this.project.tasks()
    });
    form.render();
  },

  delete_project: function (e) {
    this.model.collection.remove(this.model);
    this.model.destroy();
    this.remove();
    var url = Backbone.history.fragment.split("/").slice(0, -1).join("/");
    Backbone.history.navigate(url);
  },

  // show_members: function () {
  //   var modal = new Nexproc.Views.TeamMembersModal({
  //     team: this.model,
  //     collection: this.model.members()
  //   });
  // },

  addChildren: function () {
    // this.model.members().each( this.addMemView.bind(this) );
    this.model.tasks().each( this.addTaskView.bind(this) );
  },

  // addMemView: function (member) {
  //   var mView = new Nexproc.Views.MembersIndexItem({ model: member });
  //   this.addSubview('ul#members.list-group', mView);
  // },

  addTaskView: function (task) {
    var tView = new Nexproc.Views.TasksIndexItem({ model: task });
    this.addSubview('ul#tasks.list-group', tView);
  },

  //TODO

  deleteTask: function (e) {
    var that = this;
    var params = { project_id: this.model.id };
    this.model.members().destroy(this.model.id);
    that.mainView.removeModelSubview('ul#tasks.list-group', that.model);
    this.remove();
  }
});
