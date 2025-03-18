
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="container max-w-3xl py-6">
      <Button variant="ghost" className="mb-4" asChild>
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      
      <Card>
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl sm:text-2xl uppercase">Introgy Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="text-center mb-16">
            <p className="mb-12">Last Updated on and Effective from: 13 March, 2025</p>
            <p className="uppercase font-semibold">Proprietary & Confidential</p>
          </div>

          <h2>1. Introduction</h2>
          <p>
            We, MinaZiggy Co LLC ('Comapny, 'we', 'our' or 'us'), are committed to protecting your privacy. This Privacy Policy ('Privacy Policy' or 'Policy') applies to all persons using our services on the Platform (defined hereinbelow), playing the game or when you otherwise do business or make contact with us. This Policy governs our personal data collection, processing and usage practices. It also describes your choices regarding use, access and correction of your personal information.
          </p>
          <p>
            By using our app or website www.Introgy.ai ('Allstars' or 'Website' or 'Platform' or 'App'), as the context requires), you ('user' 'you', 'your') consent to this Policy and to the personal data practices described in it, in addition to consenting to it explicitly when using the Platform. If you do not agree with the personal data practices described in this Policy, you may choose to stop using our services and the Platform immediately. We periodically update this Policy. We encourage you to review this Policy periodically.
          </p>
          <p>
            Any terms, words, or phrases not defined in this Policy, have the meaning prescribed to them in the Allstars' Terms and Conditions (available at www.Introgy.ai/privacy-policy).
          </p>

          <h2>2. Purpose and Consent</h2>
          <p>
            This Policy has been developed for purposes of compliance with the Data Protection Act 2021 ('DPA') of the United States of America ('US'), and other data protection-oriented provisions within applicable regulations. The Policy shall serve as part of your initial customer relationship with us and our ongoing commitments to you.
          </p>
          <p>
            When you are asked to provide personal information, you may decline, but if you choose not to provide data that is necessary to enable us to make the game available to you, you may not be able to sign up for or play the game, and/or certain game features may be limited. If you fail, neglect and/ or refuse to, or are unable to provide us any personal Information which we necessarily need to provide you with services, or which we need to collect by law (for example: identification information for KYC/AML obligations), we may not be able to provide you services. In this case, we have the right to discontinue the provision of services to you and/or close your account. In such a situation, we will notify you at the earliest.
          </p>
          <p>
            Introgycollects certain personal information to enable us to operate the game effectively, and to provide you with the best experiences on our website and our game. We pride ourself on transparency and as such, you have choices about the personal information we collect.
          </p>
          <p>
            Some of the information we obtain is collected to comply with applicable laws and regulations, including anti-money laundering laws. This Policy explains:
          </p>
          <ul>
            <li>The types of information we collect about you;</li>
            <li>How we use information about you;</li>
            <li>Types of information we disclose to third parties and the types of such third parties;</li>
            <li>How we safeguard your personally identifiable information; and</li>
            <li>How you may instruct us not to disclose certain information about you which we are otherwise permitted to disclose by law.</li>
          </ul>
          <p>
            This Policy has been developed with the objective to promote transparency and accountability in the processing of Personal Data.
          </p>

          <h2>3. Changes to this Policy</h2>
          <p>
            From time to time, we may revise, amend, or supplement this Policy to reflect necessary changes in law, our Personal Data collection and usage practices, the features of our offerings, or certain advances in technology. If any material changes are made to this Policy, the changes may be prominently posted on the affected or relevant Platform. However, the onus is also on you to occasionally familiarize yourself with the contents of this Policy, for your own information, and particularly to do so every time you access our Platform or make use of our services.
          </p>
          <p>
            Changes to this Policy are effective when they are published.
          </p>

          <h2>4. Personal Data Protection Principles</h2>
          <p>
            Your Personal Data is collected and processed in accordance with the relevant data protection principles, including: lawfulness, fairness and transparency; purpose limitation; collection limitation; data minimization; accuracy; rectification measures; storage limitation; integrity and confidentiality (security); with all relevant laws and regulations considered; and however applicable. The other data protection principles that we follow are:
          </p>
          <ul>
            <li><strong>Notice and Choice Principle:</strong> We briefly capture the purposes in this Policy for which the user's Personal Data is collected and the user's right to request access to and to request correction of the user's Personal Data.</li>
            <li><strong>Disclosure Principle:</strong> We don't disclose user's Personal Data without the user's consent, for any purposes other than the purposes provided herein in this Policy.</li>
            <li><strong>Security Principle:</strong> We take practical steps/measures to protect user's Personal Data from any loss, misuse, modification, unauthorized or accidental access or disclosure, alteration, or destruction.</li>
            <li><strong>Retention Principle:</strong> We do not keep the processed user information for longer than is necessary for the fulfilment of the purpose while providing the services to the user.</li>
            <li><strong>Personal Data Integrity Principle:</strong> The user information provided by the user while availing the services through the Platform must be accurate, complete, not misleading and up to date.</li>
            <li><strong>Access Principle:</strong> The user has the right to access user's Personal Data and to rectify user Personal Data.</li>
          </ul>

          <h2>5. Consent for Performance of Contract, Rectification, Legal Obligations; Consent Withdrawal</h2>
          <p>
            You provide consent to your Personal Data (whether provided directly by you, whether collected by us, or received by us from third parties or otherwise) being processed to satisfy all legal obligations arising from any contracts entered into/ with/ involving you or to deliver any services to you which you have contracted with us to provide to you; or to take steps at your request prior to entering into a contract with you.
          </p>
          <p>
            By applying or signing up for our services, you authorize and consent to our obtaining from, and disclosing to, third parties any information about you or processing of the Personal Data in connection with identity or account verification, fraud detection, or collection procedure, or as may otherwise be allowed or required by applicable law.
          </p>
          <p>
            You can request the access to your Personal Data retained with us and can further request for correction in the retained Personal Data. If you wish to submit the request, please contact us at SUPPORT@INTROGY.AI.
          </p>
          <p>
            You can withdraw such consent to your Personal Data. Such withdrawal will not affect the lawfulness of processing based on previously recorded consent. Such withdrawal will take effect within 30 calendar days of submission of request. If you wish to submit such a request, please contact us at SUPPORT@INTROGY.AI.
          </p>
          <p>
            The specific information we collect, the method by which we collect such Personal Data, the purposes for which we collect such Personal Data, how we share such Personal Data, and how long we retain such Personal Data is explained individually, specifically for your clear, simple and withdrawable consent below in this Policy.
          </p>

          <h2>6. Information We Collect About You</h2>
          <p>
            We collect the following information ('Personal Data') about you:
          </p>
          <ul>
            <li>Identification information, such as your name, email address, home address, phone number, date of birth, gender, country and city of origin/residence, profile pictures, billing address, username, along with identification details of documents confirming such details;</li>
            <li>Financial information, including without limitation bank account and payment card numbers, bank statements, digital asset wallet addresses (including but not limited to cryptocurrency wallet addresses);</li>
            <li>Other information you provide when you participate in promotions offered by us or our partners, respond to our surveys, or otherwise communicate with us;</li>
            <li>Information about when and where the transactions occur, the names of the transacting parties, a description of the transactions, the payment or transfer amounts, billing and shipping information, and the devices and payment methods used to complete the transactions;</li>
            <li>Information about the location of your device and some other device specifics, including your hardware model, operating system and version, unique device identifier, mobile network information, and information about the device's interaction with our services;</li>
            <li>Information about how you use our services, including your carrier operating system, connection type, referring URLs, access time, browser type and language, and Internet Protocol ('IP') address, as well as other information which may be collected and used by us automatically through the browser on your device or otherwise;</li>
            <li>Information about you from third parties, including third-party verification services, mailing list providers, and publicly available sources (where lawful, this information may include your government-issued identification number);</li>
            <li>Information collected by Cookies and Web beacons (defined below), including using web beacons and sending cookies to your device (for more information on this please see our Cookies Policy at www.Introgy.ai/cookies;</li>
            <li>Pictures of your ID, utility bills, and other documents as may be requested by us and provided by you;</li>
            <li>Information contained in or relating to any communication that you send to us with or without our request, including without limitation the communication content and metadata associated with the communication.</li>
          </ul>
          <p>
            Personal data may also include information we collect about your individual preferences. We may collect the personal data in course of your signing up for our services, or in course of our identity or account verification process, or in course of your use of our services.
          </p>
          <p>
            This policy applies to your personal data when you use our Website and interact generally with us but does not apply to third-party sites. We are not responsible for the privacy policies or content of third-party sites.
          </p>
          <p>
            For the avoidance of doubt, unless stated otherwise, this policy will govern our collection of your Personal Information irrespective of the forum. Your continued usage of our website and/or services will be taken to indicate your acceptance of the terms of this privacy policy insofar as it relates to our Website.
          </p>
          <p>
            We do not knowingly collect data from, or market to, children below the legal age as established under their relevant domestic laws. By using the services, you represent that you are at least the age of majority within your respective domestic law or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the services. If we learn that personal Information from users who are less than the age of majority has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records.
          </p>

          <h2>7. Mode of Collection</h2>
          <h3>7.1. Information you provide to us directly</h3>
          <p>
            When you register for your account, we collect Personal Data about you. Depending on the services you choose, we may require you to provide us with your name, postal address, telephone number, email address and identification information to establish an account. As a registered user you may also upload data or post various queries. You can share with us additional information as your Personal Data such as details of your interest and other related details.
          </p>
          <p>
            We usually collect and store information including in paper, the physical and electronic forms provided by you when you communicate with us by telephone, email, web-based form, letter, facsimile, or other means, including when:
          </p>
          <ul>
            <li>you contact us over the phone;</li>
            <li>we provide you with our services via telephone, email, or our Website;</li>
            <li>we provide you with assistance or support for our products or services;</li>
            <li>you participate in our functions, events, or activities or on our social media pages;</li>
            <li>you request that we provide you with information concerning our products or services;</li>
            <li>you upload or submit information to us or our Website; or</li>
            <li>you complete any forms requesting information from you, including on registration with us, complete any survey or provide feedback to us concerning our products or services.</li>
          </ul>

          <h3>7.2. Information collected automatically</h3>
          <p>
            We also may receive and store certain Personal Data about you and your device(s) automatically when you access or use our services. This information may include:
          </p>
          <ul>
            <li><strong>Technical information:</strong> We collect technical information associated with your activity on our Platform and may include information related to your browser and operating system, IP address (the Internet address of your computer) unique device identifiers, and other information such as your device type.</li>
            <li><strong>Site usage information:</strong> We collect certain information to better understand customer traffic patterns and site usage. This may include the webpage that you were visiting before accessing our Platform, the pages or features of our Platform you browsed to inform us which part of our site, app and Service you visit and how much time you spend there.</li>
            <li><strong>Site preferences and cookies:</strong> We collect certain information about your preferences to make your use of the site more productive through the use of cookies. Cookies are intended to make using the service easier by, among other things, saving your preferences for you. For details of how we use cookies for this purpose, please review our cookie policy at www.Introgy.ai/cookies.</li>
          </ul>
          <p>
            While we do not use some of this information to identify you personally, we may record certain information about your use of our Websites such as which pages you visit and the time and date of your visit, and that information could potentially be used to identify you.
          </p>
          <p>
            It may be possible for us to identify you from information collected automatically from your visit(s) to our Website. If you have registered an account with us, we will be able to identify you through your user name and password when you log into our Website. Further, if you access our Website via links in an email we have sent you, we will be able to identify you.
          </p>

          <h3>7.3. Information collected from third-party services</h3>
          <p>
            We collect Personal Data of the User from third party partners who have your consent to provide us this Personal Data, and if you have given us consent to collect such Personal Data. We will gather such Personal Data from third parties and service providers who you have authorized to collect, process and share your Personal Data with.
          </p>

          <h2>8. Use of Information</h2>
          <p>
            We do not sell, exchange or give to any other person your Personal Data, whether public or private, for any reason whatsoever, without your consent, other than for the express purpose of providing our services to you.
          </p>
          <p>
            We collect, process, and use your Personal Data for the following purposes:
          </p>
          <ul>
            <li>To provide the services to you, including without limitation to process your transactions and your instructions to use our services;</li>
            <li>To improve, personalize and facilitate your use of our services;</li>
            <li>To measure, customize, and enhance our services, including the design, content, and functionality of the Platform, or to track and analyze trends and usage in connection with our services;</li>
            <li>To analyze use of our services;</li>
            <li>To improve our customer service;</li>
            <li>With your prior permission, to send periodic emails, news and information, or to conduct surveys and collect feedback, about our services and to communicate with you about products, services, promotions, discounts, incentives, and rewards offered by us and select partners, based on your communication preferences and applicable law, and the email address you provided for such communications;</li>
            <li>To administer our internal information processing and other IT systems;</li>
            <li>To operate our Platform and to provide our services, including to ensure their security;</li>
            <li>To maintain back-ups of our databases and to keep the records in accordance with our internal policies and procedures and the applicable law;</li>
            <li>To communicate with you, including without limitation to deliver the information and support you request, including technical notices, security alerts, and support and administrative messages, to resolve disputes, collect fees, and provide assistance for problems with our services;</li>
            <li>To establish, exercise or defend legal claims, whether in court proceedings or in an administrative or out-of-court procedure for the protection and assertion of our legal rights, your legal rights and the legal rights of others;</li>
            <li>To obtain or manage risks, or obtain professional advice;</li>
            <li>To comply with our obligations either required by law or by written agreements with third parties;</li>
            <li>To display transactions history;</li>
            <li>To develop new products and services; and</li>
            <li>In order to: (i) protect our rights or property, or the security or integrity of our services; (ii) enforce the terms of our Terms and Conditions or other applicable agreements or policies; (iii) verify your identity (e.g., some of the government-issued identification numbers we collect are used for this purpose); (iv) investigate, detect, and prevent fraud, security breaches, and other potentially prohibited or illegal activities; (v) comply with any applicable law, regulation, or legal process.</li>
          </ul>
          <p>
            We may use third-party service providers to, process and store your information in the US and other countries in our sole discretion with the protective measures implemented and provided under this Policy.
          </p>

          <h2>9. We Process and Use Aggregated, Anonymized and De-identified Personal Data</h2>
          <p>
            We may also create, process, collect, use and share aggregated, anonymized or de-identified Personal Data such as statistical or demographic data for any purpose which may be derived from your Personal Data. We may use your Personal Data to comply with legal or regulatory obligations.
          </p>
          <p>
            The Personal Data shall be processed with the Retention, Data Integrity and Access Principles provided in Clause 4 of this Policy.
          </p>
          <p>
            We may share such Personal Data with members of our group, service providers and our key partners. Some of these third parties may be in a jurisdiction outside the laws as stated in this Policy, in which case we will take all necessary steps to ensure that your Personal Data is treated securely with adequate protection safeguards and that such transfers are permitted under the applicable data protection laws.
          </p>
          <p>
            We may also use any or all of the Personal Data above to administer and manage our business in general, to detect and prevent misuse of our services (including fraud and unauthorized payments), and to enforce our Terms and Conditions or any other contract to which we may be a party to.
          </p>

          <h2>10. Processing Without Consent</h2>
          <p>
            We may collect and process some of your Personal Data without your knowledge or consent; and only where this is required or permitted by law. We may be compelled to surrender your Personal Data to legal authorities without your express consent, if presented with a court order or similar legal or administrative order, or as required or permitted by the laws, rules and regulations of any nation, state or other applicable jurisdiction. Other situations where your Personal Data may be processed without your express consent include without limitation:
          </p>
          <ul>
            <li>Where processing is related to Personal Data made publicly available by you;</li>
            <li>Where processing is necessary to initiate or defend procedures relating to claim of rights and legal actions or are associated with legal or judicial procedures;</li>
            <li>Where processing is necessary for the performance of any contract entered into where you are a party or for taking any action upon your request for concluding, amending or terminating such contract; and</li>
            <li>Where processing is necessary for public interest.</li>
          </ul>

          <h2>11. Disclosure of Your Personal Data to Third Parties</h2>
          <p>
            We may have to share your personal information with a selected and trusted group of third party/parties to fulfil our obligations under our contract with you, to meet government, regulatory and law enforcement requests, and to continue providing you with the services. We shall ensure any such third party is aware of our obligations under this Policy and we enter into contracts with such third parties by which they are bound by terms no less protective of any Personal Data disclosed to them, than the obligations we undertake to you under this Policy or which are imposed on us under applicable data protection laws. We do not allow our third-party service providers to use your personal information for their own purposes and only permit them to process your personal information for specified purposes and in accordance with our instructions.
          </p>
          <p>
            In case of termination of our business relationships with such third parties we shall ensure that all your Personal Data is either retrieved from such third party or is destroyed. We shall also confirm in our contracts with such third parties that the third party does not have the right to use such Personal Data for unauthorized purposes.
          </p>
          <p>
            We may share or transfer your personal Information in the specific circumstances hereinbelow:
          </p>
          <ul>
            <li>to our related entities, employees, officers, agents, contractors, other companies that provide services to us, sponsors, government agencies, or other third parties to satisfy the purposes for which the information was collected or for another purpose if that other purpose is closely related to the primary purpose of collection and an individual would reasonably expect us to disclose the information for that secondary purpose;</li>
            <li>to third parties who help us to verify the identity of our clients and customers, and other software service providers who assist us to provide the services we provide to you;</li>
            <li>to third parties who help us analyze the information we collect so that we can administer, support, improve or develop our business and the services we provide to you including cloud hosting services, off-site backups, and customer support;</li>
            <li>to merchants and the recipients of funds to identify you as the sender of the funds and to a party who sends you funds in connection with a transfer to you of funds;</li>
            <li>to third parties, including those in the blockchain industry, marketing and advertising sectors, to use your information to let you know about goods and services which may be of interest to you in accordance with the applicable laws;</li>
            <li>if the disclosure is requested by law enforcement or government agency or is required by law, or legal process, such as a subpoena, court, or another legal process with which we are required to comply, including about our obligations under applicable anti-money laundering laws;</li>
            <li>if the disclosure is required to enforce the terms of this policy or to enforce any of our terms and conditions with you;</li>
            <li>to our professional advisers such as consultants, bankers, professional indemnity insurers, brokers, and auditors so that we can meet our regulatory obligations, and administer, support, improve or develop our business;</li>
            <li>to debt recovery agencies who assist us with the recovery of debts owed to us;</li>
            <li>to any other person, with your consent (express or implied);</li>
            <li>to facilitate the sale of all or a substantial part of our assets or business or to companies with which we propose to merge or who propose to acquire us and their advisers;</li>
            <li>to protect the interests of our users, clients, customers, and third parties from cyber security risks or incidents and other risks or incidents; and</li>
            <li>to maintain the integrity of our Website and protect our rights, interests, and property and those of third parties.</li>
          </ul>
          <p>
            In the event of a proposed restructure or sale of our business (or part of our business) or where a company proposes to acquire or merge with us, we may disclose personal data to the buyer and their advisers without your consent subject to compliance with the applicable regulations. If we sell the business and the sale is structured as a share sale, you acknowledge that this transaction will not constitute the 'transfer' of personal data.
          </p>

          <h2>12. International Transfer of Information</h2>
          <p>
            Your Personal Data is stored and transferred in compliance with the applicable legislation or regulations of every jurisdiction in which we operate.
          </p>
          <p>
            If you are based in the UK, the EU or the EEA, any storage, processing and transfer of your Personal Data outside these territories will adhere to the relevant legal requirements, particularly the GDPR, as and however applicable and/or required.
          </p>
          <p>
            If you are based in the British Virgin Islands, the storage and protection of the Personal Data will be in compliance with DPA. The protection measures for your Personal Data shall be taken in accordance with this Policy.
          </p>
          <p>
            Some of our external third-party service providers may also be based outside of the UK, EU, EEA, or US so their processing, storage and transfer of your Personal Data will involve the transfer to and from and storage of data outside such jurisdiction. We reiterate that by using our services you accept the terms of their individual privacy policies, cookies policies, as well as terms and conditions.
          </p>
          <p>
            Some of the international organizations and countries to which your Personal Data may be transferred do not benefit from an appropriate data protection regulatory framework. For such international organizations and countries, we shall transfer your Personal Data, only upon ensuring that a suitable degree of protection is afforded to it through the implementation of the necessary safeguards, such as an adequacy decision by the relevant authority, adequate binding corporate rules or through the inclusion of standard contractual clauses in our agreements with such organizations and countries.
          </p>
          <p>
            Without prejudice to Section 5 of this Policy, you should be aware that we transfer your Personal Data outside US, to the following third-party service providers (albeit, the same shall not be construed as a closed list):
          </p>
          <p>
            Introgys is a fast-growing company with various global partnerships. You should be aware that certain third-party service providers, such as payment gateways and other payment transaction processors, may be located in, or have facilities that are located in, outside US in a different jurisdiction than either you or us. If you wish to procure specific information about the third-party service providers with whom your Information has been shared, please contact us at SUPPORT@INTROGY.AI. Therefore, if you elect to proceed with a transaction that involves the services of a third-party service provider, then your Personal Data may become subject to the laws of the jurisdiction(s) in which that service provider or its facilities are located. For example, if you are located in the US and your transaction is processed by a payment gateway located outside of the US, then your Personal Data used in completing that transaction may be subject to disclosure under that jurisdiction's data-specific legislation. For these providers, we recommend that you read their respective privacy policies, so you can understand the manner in which your Personal Data will be handled by these providers.
          </p>

          <h2>13. Third-Party Advertising and Analytics</h2>
          <p>
            We may allow third-party service providers to deliver content and advertisements in connection with our services and to provide anonymous site metrics and other analytics services to promote and improve our Services. These third parties may use cookies, web beacons, and other technologies to collect Information, such as your IP address, identifiers associated with your device, other applications on your device, the browsers you use to access our services, webpages viewed, time spent on webpages, links clicked, and conversion information (e.g., transactions entered into). This information which could be your Personal Data may be used by us and third-party service providers on our behalf to analyze and track usage of our services, determine the popularity of certain content, deliver advertising and content targeted to your interests, and better understand how you use our services.
          </p>
          <p>
            The third-party service providers that we engage are bound by confidentiality obligations and applicable laws with respect to their use and collection of your Personal Data.
          </p>
          <p>
            This Policy does not apply to, and we are not responsible for, third-party cookies, web beacons, or other tracking technologies, which are covered by such third parties' privacy policies. For more information, we encourage you to check the privacy policies of these third parties to learn about their privacy practices.
          </p>

          <h2>14. Links to Third-Party Websites</h2>
          <p>
            Our Platform or communications may contain links to other third-party websites which are not owned or operated by us and are regulated by their own privacy policies. If you click on a third-party link, you will be directed to that third party's platform. We strongly advise you to review the privacy policy of every platform you visit.
          </p>
          <p>
            This Policy does not apply to, and we are not responsible for the privacy policies of these third-party websites regardless of whether they were accessed while using links from our Platform or communications.
          </p>

          <h2>15. Your Rights in Relation to Your Personal Data</h2>
          <p>
            You have the following rights with respect to your Personal Data:
          </p>

          <h3>15.1. Right to be informed</h3>
          <p>
            You have a right to know:
          </p>
          <ul>
            <li>Our identity and the contact details available at [please insert];</li>
            <li>The purposes of the processing your Personal Data as well as the legal basis for the processing;</li>
            <li>The legitimate interests pursued by us or by a third party who processes your Personal Data (if you are a citizen of a European Union member state);</li>
            <li>The recipients or categories of recipients of your Personal Data;</li>
            <li>Our intention to transfer your Personal Data to a third country or international organization and the existence or absence of an adequacy decision by the relevant supervisory authority, or where applicable, reference to the appropriate safeguards and the means to obtain their copy.</li>
            <li>The period for which your Personal Data will be stored, or if that is not possible, the criteria used to determine that period (if you are a citizen of a European Union member state and US);</li>
            <li>Whether the provision of Personal Data is a statutory or contractual requirement, or a requirement necessary to enter into a contract, as well as whether you are obligated to provide the Personal Data and of the possible consequences of failure to provide such Personal Data;</li>
            <li>The existence of automated decision-making, including profiling and meaningful information about the logic involved.</li>
            <li>Where we intend to further process your Personal Data for a purpose other than that for which the Personal Data was collected for, we must apprise you, prior to such further processing, with information on those other purposes and with any other relevant information.</li>
          </ul>

          <h3>15.2. Right to access to Personal Data</h3>
          <p>
            This is your right to see what personal data is held about you by us. Particularly you have the right to request and obtain the following information:
          </p>
          <ul>
            <li>The categories of Personal Data processed;</li>
            <li>The purpose of the processing;</li>
            <li>Automated decision making on your Personal Data, if applicable;</li>
            <li>Controls or standards relating to storage of your Personal Data;</li>
            <li>Actions for rectification, restriction, or erasure of your Personal Data;</li>
            <li>The recipients to whom Personal Data is transferred and any applicable safeguards in case of cross border Personal Data transfer;</li>
            <li>The existence of your right to request from us rectification or erasure of Personal Data (if you are a citizen of a European Union member state and US);</li>
            <li>Details pertaining to the source of Personal Data, where such personal data has not been collected from you (if you are a citizen of a European Union member state);</li>
            <li>Copy of the Personal Data undergoing processing (if you are a citizen of a European Union member state);</li>
            <li>Actions to be taken in case of Personal Data breach where such breach affects you; and</li>
            <li>Procedure to lodge a complaint with the applicable regulatory authorities.</li>
          </ul>
          <p>
            We may refuse your demand if request is excessively repeated, is in contravention of judicial proceeding or investigations, negatively impacts our endeavors to maintain Personal Data security, or relates to the privacy of a third party.
          </p>
          <p>
            If the User is from US, we can refuse to provide the access to Personal Data upon the fulfillment of any of the following conditions:
          </p>
          <ul>
            <li>If the compliance with the request will be in contravention of the provisions of DPA;</li>
            <li>where another person can be identified from the access to the User's Personal Data; or</li>
            <li>where we obtain written approval from the administrative authority ('Information Commissioner') of the DPA.</li>
          </ul>

          <h3>15.3. Right to rectification</h3>
          <p>
            You have the right to rectify any inaccurate Personal Data about you retained with us and to complete any incomplete Personal Data about you, provided however, the requisite procedures as outlined within the DPA are adhered to.
          </p>

          <h3>15.4. Right to erasure</h3>
          <p>
            You have the right to demand erasure of your Personal Data with us if:
          </p>
          <ul>
            <li>the Personal Data is no longer necessary in relation to the purposes for which it was collected or otherwise processed;</li>
            <li>you withdraw consent to consent-based processing;</li>
            <li>you object to the processing of your Personal Data under the applicable law;</li>
            <li>your Personal Data has been unlawfully processed; and</li>
            <li>your Personal Data must be erased for compliance with legal obligations (if you are a citizen of a European Union member state and US).</li>
          </ul>
          <p>
            We may refuse your demand if your Personal Data is processed for compliance with a legal obligation; or establishment or exercise or defense of legal claims.
          </p>

          <h3>15.5. Right to restrict processing</h3>
          <p>
            You have the right to restrict processing of your Personal Data if:
          </p>
          <ul>
            <li>you contest the accuracy of the Personal Data;</li>
            <li>processing is unlawful;</li>
            <li>we no longer need the Personal Data for the purposes of our processing, but you require Personal Data for the establishment, exercise or defense of legal claims; and</li>
            <li>you have objected to processing, pending the verification of that objection, in which case we may continue to store your Personal Data, but we will only otherwise process it: (i) where aforementioned processing is restricted only to storage of said information; (ii) with your consent; (iii) for the establishment, exercise or defense of legal claims; (iv) for the protection of the rights of another natural or legal person; or (v) for reasons of important public interest.</li>
          </ul>

          <h3>15.6. Right to stop or withdraw consent for processing</h3>
          <p>
            You have the right to object to our processing of your Personal Data and stop the processing of said Personal Data in the following cases:
          </p>
          <ul>
            <li>if such processing was done for direct marketing purposes,</li>
            <li>if such processing was done for statistical survey purposes, unless such processing is necessary for public interest;</li>
            <li>where such processing is in contravention of personal data protection controls as envisaged by the PDPL and mentioned under Clause 4 (Personal data protection principles); and</li>
            <li>where you have requested to withdraw consent for the processing of Personal Data in accordance with Clause 8(2) of DPA.</li>
          </ul>

          <h3>15.7. Right to Personal Data portability</h3>
          <p>
            You have the right to Personal Data portability to the extent that:
          </p>
          <ul>
            <li>the legal basis for our processing of your Personal Data is your consent, or is a necessity to perform a contract to which you are party; or</li>
            <li>such processing is carried out by automated means.</li>
          </ul>
          <p>
            You have the right to receive your Personal Data from us in a structured, commonly used and machine-readable format. Where technically feasible, you may also request us to transmit your Personal Data directly to another entity.
          </p>

          <h3>15.8. Right to object to automated decision making</h3>
          <p>
            You have the right to object to automated decision making (if any) if it has legal or serious consequences that affect you. Such requests may be refused by us if such automated processing is performed in accordance to any contract between you and Allstars, is necessary for compliance with other legislation, or you have specifically provided consent for such practices.
          </p>

          <h3>15.9. Right to lodge a complaint with the supervisory authority</h3>
          <p>
            If you are an EU, UK or EEU citizen, you have the right to lodge a complaint with the supervisory authority of the member state in which you are habitually resident, or with the supervisory authority of the member state in which you work or in which your rights under the GDPR have been infringed if you believe such infringement has taken place.
          </p>
          <p>
            If you are a citizen of US, you have the right to raise complaint in writing to the Information Commissioner regarding your breach of right under the DPA or you believe that such infringement has taken place.
          </p>

          <h2>16. Submission of Requests for Exercise of Rights</h2>
          <p>
            We aim to respond to all legitimate requests without undue delay and within 2 calendar months of receipt of any request from you. Occasionally it may take us longer than 2 calendar months, if your request is particularly complex, or if you have made duplicated or numerous requests. In this case, we will notify you of receipt of such request(s) and keep you updated as to the status of progress concerning such request(s).
          </p>
          <p>
            If you are a citizen of US, then your legitimate request to 'Right to Access of Personal Data' will be responded by us within the time period of 30 days. However, the time period could be extended by Chief Executive Officer by not more than 30 days if:
          </p>
          <ul>
            <li>meeting the original time limit would unreasonably interfere with our operations; or</li>
            <li>consultations are required to comply with your request that cannot be reasonably be completed within the original time limit of 30 days.</li>
          </ul>
          <p>
            If you wish to exercise any of the rights mentioned under Clause 16 (Your rights in relation to your Personal Data), please contact us at SUPPORT@INTROGY.AI. We may need to request specific information from you to help us confirm your identity and ensure your entitlement to such rights. This security measure is to ensure that your Personal Data is not disclosed to any person who has no right to receive it.
          </p>

          <h2>17. Personal Data Retention</h2>
          <p>
            We retain Personal Data on your behalf, including customer data, transactional data and other session data, linked to your account.
          </p>
          <p>
            Your Personal Data will be processed for no period longer than as required by us for the purposes it was collected for, for the purposes of using our services, and for meeting any legal, accounting, reporting, government, regulatory or law enforcement requirements. However, all Personal Data and related documents, records and files will be securely retained for a period of 90 days, as required. Such retention period shall be calculated from the date of closing of your account.
          </p>

          <h2>18. Legal Recourse to Relevant Authorities</h2>
          <p>
            If you are based in the UK, EU or the EEA region, then you have the right to make a complaint at any time to a supervisory or regulatory authority, within the UK, or a member state in the EU or EEA where you are habitually resident, where we may be based (if applicable), or where an alleged infringement of any data protection law has taken place.
          </p>
          <p>
            If you are a citizen of US, you have the right to raise complaint in writing to the Information Commissioner regarding your breach of right under the DPA or you believe that such infringement of DPA has taken place.
          </p>
          <p>
            However, we would appreciate the opportunity to address your concerns before you approach any such authority. Please contact us in the first instance so that we may try to resolve your complaint swiftly and satisfactorily. Please contact us via email at SUPPORT@INTROGY.AI.
          </p>

          <h2>19. Security Precautions and Measures</h2>
          <h3>19.1. Information security</h3>
          <p>
            We are committed to ensuring that your Personal Data is secure. To prevent unauthorised access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online. We use industry-standard technical mechanisms and ensure that our affiliates or vendor entities use data encryption technology while implementing restrictions related to the storage of and the ability to access your Personal Data.
          </p>
          <p>
            Our facilities are scanned on a regular basis for security holes and known vulnerabilities, to best ensure its security. Your Personal Data is contained behind secured networks and is only accessible by a limited number of individuals who have special access rights to such systems and are required to keep the information confidential.
          </p>
          <p>
            We also have mechanisms in place to access your Personal Data in case of an actual or technical failure. We also ensure testing and evaluation of our technical and organizational measures at regular intervals to gauge the effectiveness of such measures.
          </p>

          <h3>19.2. No guarantee</h3>
          <p>
            Please note that no transmission over the internet or any method of electronic storage can be guaranteed to be absolutely 100% secure, however, our best endeavors will be made to secure data and the ability to access your Personal Data.
          </p>
          <p>
            Without prejudice to our efforts on protection of your Personal Data, nothing contained in this Policy constitutes a warranty of security of the facilities, and you agree to transmit data at your own risk.
          </p>
          <p>
            Please note, that we do not guarantee that your Personal Data may not be accessed, disclosed, altered, or destroyed by breach of any of our physical, technical, or managerial safeguards. Please, always check that any website on which you are asked for financial or payment information in relation to our services is in fact legitimately owned or operated by us. The risk of impersonating hackers exists and should be taken into account when using our Platform.
          </p>
          <p>
            If you do receive any suspicious communication of any kind or request, do not provide your Information and report it us by contacting our offices immediately at SUPPORT@INTROGY.AI. Please also immediately notify us at SUPPORT@INTROGY.AI if you become aware of any unauthorized access to or use of your account.
          </p>
          <p>
            Since we cannot guarantee against any loss, misuse, unauthorised acquisition, or alteration of your Personal Data, please take the necessary steps to protect your own Personal Data, including the adoption of sufficient safety measures such as your choosing of an appropriate password of sufficient length and complexity and to not reveal this password to any third parties.
          </p>
          <p>
            Furthermore, we cannot ensure and do not warrant the security or confidentiality of data transmitted to us, or sent and received from us by internet or wireless connection, including: email, phone, WhatsApp or SMS, since we have no way of protecting that information once it leaves and until it reaches us. If you have reason to believe that your Personal Data is no longer secure, please contact us SUPPORT@INTROGY.AI.
          </p>
          <p>
            We also aim to conduct all applicable security risk assessments to ensure the availability of risk mitigation controls, to better safeguard the integrity of your Personal Data.
          </p>

          <h3>19.3. Personal Data breaches</h3>
          <p>
            Should your Personal Data be breached, and the security of your rights be at risk, we shall promptly and immediately communicate to you the nature of the breach which has taken place, the likely consequences of such a breach and shall describe thoroughly the measures we have implemented to address the breach and to mitigate any and all adverse effects to you and your rights. In the unlikely event of a breach occurring, please reach out to us at SUPPORT@INTROGY.AI for further information and for further advise on how to mitigate the potential adverse effects of such a breach.
          </p>

          <h2>20. Contacting Us</h2>
          <p>
            If you have any questions about our Policy as outlined above, or if you have any complaints, please contact us at SUPPORT@INTROGY.AI.
          </p>
          <p>
            If you have any queries or issues pertaining to your Personal Data or our Policy, then please do write to us at any time by emailing us via SUPPORT@INTROGY.AI.
          </p>

          <div className="text-sm text-muted-foreground mt-8">
            Last updated: March 13, 2025
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Privacy;
