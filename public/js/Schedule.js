document.addEventListener('DOMContentLoaded', function() {
    var selectedDate;
    var calendar = $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultDate: '2024-02-12',
        editable: true,
        selectable: true,
        select: function(start, end, jsEvent, view) {
            selectedDate = start.format('YYYY-MM-DD');
        },
        eventRender: function(event, element) {
            element.attr('title', event.title);
        },
        eventSources: [
            {
                events: function(start, end, timezone, callback) {
                    fetch('/api/events')
                        .then(response => response.json())
                        .then(data => {
                            var events = data.map(event => ({
                                id: event.id,
                                title: event.event_type,
                                start: moment(event.date).format(),
                                end: moment(event.date).format() // Adjust if you have an end date
                            }));
                            callback(events);
                        })
                        .catch(error => console.error('Error fetching events:', error));
                }
            }
        ]
    });
    document.getElementById('createEventButton').addEventListener('click', function() {
        $('#createEventModal').modal('show');
    });
    document.getElementById('deleteDayButton').addEventListener('click', function() {
        if (confirm('Delete events for ' + selectedDate + '?')) {
            var eventsToRemove = $('#calendar').fullCalendar('clientEvents', function(event) {
                return moment(event.start).format('YYYY-MM-DD') === selectedDate;
            });
            eventsToRemove.forEach(function(event) {
                // Assuming you have an endpoint to delete events by ID
                fetch(`/api/events/${event.id}`, { method: 'DELETE' })
                    .then(response => {
                        if (!response.ok) throw new Error('Failed to delete event');
                        $('#calendar').fullCalendar('removeEvents', event.id);
                    })
                    .catch(error => console.error('Error deleting event:', error));
            });
        }
    });
    document.getElementById('submitButton').addEventListener('click', function() {
        var title = document.getElementById('eventTitle').value;
        var date = document.getElementById('eventDate').value;
        fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: title,
                date: date,
                
                // Include dog_id if necessary
            }),
        })
        .then(response => response.json())
        .then(newEvent => {
            $('#calendar').fullCalendar('renderEvent', {
                id: newEvent.id, // Make sure your backend sends back the ID
                title: newEvent.event_type,
                start: newEvent.date,
                end: newEvent.date // Adjust if you have an end date
            }, true); // stick the event
            $('#createEventModal').modal('hide');
            document.getElementById('eventForm').reset();
        })
        .catch(error => console.error('Error creating event:', error));
    });
});
