import './FooterStyle.css'

function FooterMain(){
    return(
        <>
            <footer className="footerMain">
                <div className="footer-container">
                    <div className="footer-grid">
                        <div className="footer-section">
                            <h3 className="footer-logo">Doc.link</h3>
                            <p className="footer-description">Connect with doctors and book appointments or home visits easily.</p>
                            <div className="social-links">
                                <a href="#" className="social-link">Facebook</a>
                                <a href="#" className="social-link">Instagram</a>
                                <a href="#" className="social-link">X</a>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">Company</h4>
                            <ul className="footer-list">
                                <li><a href="#" className="footer-link">About Us</a></li>
                                <li><a href="#" className="footer-link">Careers</a></li>
                                <li><a href="#" className="footer-link">Press</a></li>
                                <li><a href="#" className="footer-link">Blog</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">Support</h4>
                            <ul className="footer-list">
                                <li><a href="#" className="footer-link">Help Center</a></li>
                                <li><a href="#" className="footer-link">Safety</a></li>
                                <li><a href="#" className="footer-link">Contact Us</a></li>
                                <li><a href="#" className="footer-link">Terms of Service</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4 className="footer-title">For Doctors</h4>
                            <ul className="footer-list">
                                <li><a href="#" className="footer-link">Join Our Network</a></li>
                                <li><a href="#" className="footer-link">Doctor Resources</a></li>
                                <li><a href="#" className="footer-link">Community Forum</a></li>
                                <li><a href="#" className="footer-link">Practice Insurance</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p className="copyright">&copy; 2025 Doc.link. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default FooterMain