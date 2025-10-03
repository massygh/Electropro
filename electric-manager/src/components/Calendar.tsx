'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default function Calendar({ events, onDateSelect }: { events: any[]; onDateSelect?: (arg: any) => void }) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
      firstDay={1}
      locale={'fr'}
      buttonText={{ today: 'Aujourd\'hui' }}
      height="auto"
      contentHeight={420}
      dayMaxEventRows={2}
      selectable={true}
      events={events}
      select={(sel) => (onDateSelect ? onDateSelect(sel) : console.log(sel))}
    />
  )
}



