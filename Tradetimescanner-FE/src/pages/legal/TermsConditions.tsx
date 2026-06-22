import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoShieldCheckmark, IoDocumentText, IoInformationCircle } from 'react-icons/io5';
import { ResponsiveContainer } from '../../components/responsive/ResponsiveContainer';
import { Button } from '../../components/forms';
import { logo } from '../../constants/imports';

const TermsConditions = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 md:py-12">
            <ResponsiveContainer maxWidth="lg">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-gray-700 hover:text-primary"
                        >
                            <IoArrowBack size={24} />
                        </button>
                        <img src={logo} alt="TradeTimeScanner Logo" className="h-10 md:h-12" />
                    </div>
                    <div className="flex gap-3">
                        <Button
                            text="Login"
                            outlined
                            onBtnClick={() => navigate('/login')}
                            width={120}
                        />
                        <Button
                            text="Sign Up"
                            onBtnClick={() => navigate('/signup')}
                            width={120}
                        />
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                    <div className="bg-primary/5 p-8 border-b border-primary/10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                            <IoDocumentText className="text-primary" />
                            Terms & Conditions
                        </h1>
                        <p className="text-gray-500 mt-2">Last updated: March 22, 2026</p>
                    </div>

                    <div className="p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">
                        {/* Section 1 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">1</span>
                                Introduction
                            </h2>
                            <p>
                                Welcome to Trade Time Scanner ("Company", "we", "our", "us"). These Terms & Conditions govern your use of our website and applications (collectively, the "Service"). By accessing or using the Service, you signify that you have read, understood, and agree to be bound by these Terms.
                            </p>
                        </section>

                        {/* Section 2 - CRITICAL FOR TRADING APPS */}
                        <section className="bg-amber-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
                            <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                                <IoInformationCircle className="text-amber-600" />
                                Financial Risk & Disclaimer
                            </h2>
                            <p className="text-amber-800 font-medium">
                                IMPORTANT: MARKET TRADING INVOLVES SUBSTANTIAL RISK. YOU SHOULD ONLY TRADE WITH MONEY YOU CAN AFFORD TO LOSE.
                            </p>
                            <p className="mt-4 text-amber-700">
                                Trade Time Scanner is a software tool provided for informational and educational purposes only. We are not registered financial advisors. All signals, scans, and analysis provided by our software are based on technical algorithms and should not be construed as investment or financial advice. We do not guarantee the accuracy or completeness of any data or analysis provided.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">2</span>
                                Use of Service
                            </h2>
                            <p>
                                You must be at least 18 years old to use this Service. You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the Service.
                            </p>
                            <ul className="list-disc ml-6 mt-4 space-y-2">
                                <li>You are responsible for maintaining the confidentiality of your account.</li>
                                <li>Commercial redistribution of our scanner results is strictly prohibited without prior authorization.</li>
                                <li>We reserve the right to terminate accounts that violate these terms.</li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">3</span>
                                Subscription & Payments
                            </h2>
                            <p>
                                Some parts of the Service are billed on a subscription basis ("Premium Plans"). Your subscription will automatically renew under the same conditions unless you cancel it.
                            </p>
                            <p className="mt-4">
                                Payments are processed through secure third-party providers. We do not store your full credit card information or crypto private keys on our servers.
                            </p>
                        </section>

                        {/* Privacy Policy Section */}
                        <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <IoShieldCheckmark className="text-primary" />
                                Privacy Policy
                            </h2>
                            <div className="space-y-6">
                                <p>
                                    Your privacy is important to us. Here is a summary of how we handle your data:
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-50">
                                        <h3 className="font-bold text-gray-900 mb-2">Data Collection</h3>
                                        <p className="text-sm">We collect your email, name, and basic usage data to provide and improve our services.</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-50">
                                        <h3 className="font-bold text-gray-900 mb-2">Third Parties</h3>
                                        <p className="text-sm">We do not sell your data. We only share info with essential providers like payment processors or hosting services.</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-50">
                                        <h3 className="font-bold text-gray-900 mb-2">Cookies</h3>
                                        <p className="text-sm">We use essential cookies to maintain your login session and improve performance.</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-50">
                                        <h3 className="font-bold text-gray-900 mb-2">Security</h3>
                                        <p className="text-sm">We use industry-standard encryption to protect your data during transmission and storage.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 6 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">4</span>
                                Limitation of Liability
                            </h2>
                            <p>
                                In no event shall Trade Time Scanner be liable for any indirect, incidental, special, or consequential damages (including loss of profits, data, or trading losses) arising out of or in connection with the use of the Service.
                            </p>
                        </section>

                        {/* Footer Contact */}
                        <div className="text-center pt-8 border-t border-gray-100">
                            <p className="text-gray-600">
                                Questions about these Terms? Contact us at:
                            </p>
                            <p className="text-primary font-bold mt-2">support@tradetimescanner.com</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 flex justify-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Trade Time Scanner. All rights reserved.
                </div>
            </ResponsiveContainer>
        </div>
    );
};

export default TermsConditions;
