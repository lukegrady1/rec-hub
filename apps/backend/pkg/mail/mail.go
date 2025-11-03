package mail

import (
	"fmt"
	"log"

	"gopkg.in/mail.v2"
)

type Mailer struct {
	Host     string
	Port     int
	FromAddr string
}

type BookingNotification struct {
	To             string
	RequesterName  string
	RequesterEmail string
	FacilityName   string
	SlotTime       string
	Status         string
	BookingLink    string
}

func NewMailer(host string, port int, from string) *Mailer {
	return &Mailer{
		Host:     host,
		Port:     port,
		FromAddr: from,
	}
}

// SendBookingRequestNotification sends an email to admin when booking is requested
func (m *Mailer) SendBookingRequestNotification(to string, bn BookingNotification) error {
	msg := mail.NewMessage()
	msg.SetHeader("From", m.FromAddr)
	msg.SetHeader("To", to)
	msg.SetHeader("Subject", fmt.Sprintf("New Booking Request - %s", bn.FacilityName))

	body := fmt.Sprintf(`
<h2>New Booking Request</h2>
<p><strong>Facility:</strong> %s</p>
<p><strong>Requester:</strong> %s (%s)</p>
<p><strong>Time Slot:</strong> %s</p>
<p><a href="%s">Review Booking</a></p>
`, bn.FacilityName, bn.RequesterName, bn.RequesterEmail, bn.SlotTime, bn.BookingLink)

	msg.SetBody("text/html", body)

	return m.send(msg)
}

// SendBookingApprovedNotification sends email when booking is approved
func (m *Mailer) SendBookingApprovedNotification(to string, bn BookingNotification) error {
	msg := mail.NewMessage()
	msg.SetHeader("From", m.FromAddr)
	msg.SetHeader("To", to)
	msg.SetHeader("Subject", fmt.Sprintf("Booking Approved - %s", bn.FacilityName))

	body := fmt.Sprintf(`
<h2>Booking Approved</h2>
<p>Great news! Your booking request has been approved.</p>
<p><strong>Facility:</strong> %s</p>
<p><strong>Time Slot:</strong> %s</p>
<p>We look forward to seeing you!</p>
`, bn.FacilityName, bn.SlotTime)

	msg.SetBody("text/html", body)

	return m.send(msg)
}

// SendBookingDeclinedNotification sends email when booking is declined
func (m *Mailer) SendBookingDeclinedNotification(to string, bn BookingNotification) error {
	msg := mail.NewMessage()
	msg.SetHeader("From", m.FromAddr)
	msg.SetHeader("To", to)
	msg.SetHeader("Subject", fmt.Sprintf("Booking Status Update - %s", bn.FacilityName))

	body := fmt.Sprintf(`
<h2>Booking Status Update</h2>
<p>Unfortunately, your booking request has been declined.</p>
<p><strong>Facility:</strong> %s</p>
<p><strong>Requested Time:</strong> %s</p>
<p>Please try another time or contact us for more information.</p>
`, bn.FacilityName, bn.SlotTime)

	msg.SetBody("text/html", body)

	return m.send(msg)
}

func (m *Mailer) send(msg *mail.Message) error {
	dialer := mail.NewDialer(m.Host, m.Port, "", "")
	if err := dialer.DialAndSend(msg); err != nil {
		log.Printf("Failed to send email: %v\n", err)
		return err
	}
	return nil
}
