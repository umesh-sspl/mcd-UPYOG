package org.egov.ewst.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.egov.common.contract.request.RequestInfo;
import org.egov.ewst.config.EwasteConfiguration;
import org.egov.ewst.models.EwasteRegistrationRequest;
import org.egov.ewst.models.event.Event;
import org.egov.ewst.models.event.EventRequest;
import org.egov.ewst.models.event.Recepient;
import org.egov.ewst.models.event.Source;
import org.egov.ewst.repository.ServiceRequestRepository;
import org.egov.ewst.util.EwasteConstants;
import org.egov.ewst.util.NotificationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

/**
 * EwasteNotificationService is responsible for processing notifications related
 * to Ewaste applications. It fetches user UUIDs based on mobile numbers and
 * sends event notifications using the NotificationUtil.
 */
@Service
@Slf4j
public class EwasteNotificationService {
	@Autowired
	private EwasteConfiguration config;
	@Autowired
	private NotificationUtil util;
	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	public void process(EwasteRegistrationRequest request) {
		EventRequest eventRequest = getEventsForEW(request);
		log.info("Event Request in Ewaste process method" + eventRequest.toString());
		if (null != eventRequest)
			util.sendEventNotification(eventRequest);

	}

	/**
	 * Creates an EventRequest object for the Ewaste application.
	 *
	 * @param request The Ewaste registration request containing application details.
	 * @return An EventRequest object containing event details.
	 */
	private EventRequest getEventsForEW(EwasteRegistrationRequest request) {

		List<Event> events = new ArrayList<>();
		String tenantId = request.getEwasteApplication().get(0).getTenantId();
		String localizationMessages = util.getLocalizationMessages(tenantId, request.getRequestInfo());
		List<String> toUsers = new ArrayList<>();
		String mobileNumber = request.getEwasteApplication().get(0).getApplicant().getMobileNumber();

		Map<String, String> mapOfPhoneNoAndUUIDs = fetchUserUUIDs(mobileNumber, request.getRequestInfo(), tenantId);

		if (CollectionUtils.isEmpty(mapOfPhoneNoAndUUIDs.keySet())) {
			log.info("UUID search failed!");
		}

		toUsers.add(mapOfPhoneNoAndUUIDs.get(mobileNumber));
		String message = null;
		message = util.getCustomizedMsg(request.getRequestInfo(), request.getEwasteApplication().get(0),
				localizationMessages);
		log.info("Message for event in Ewaste:" + message);
		Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
		log.info("Recipient object in Ewaste:" + recepient.toString());
		events.add(Event.builder().tenantId(tenantId).description(message).eventType(EwasteConstants.USREVENTS_EVENT_TYPE)
				.name(EwasteConstants.USREVENTS_EVENT_NAME).postedBy(EwasteConstants.USREVENTS_EVENT_POSTEDBY)
				.source(Source.WEBAPP).recepient(recepient).eventDetails(null).actions(null).build());

		if (!CollectionUtils.isEmpty(events)) {
			return EventRequest.builder().requestInfo(request.getRequestInfo()).events(events).build();
		} else {
			return null;
		}

	}

	/**
	 * Fetches UUIDs of CITIZEN based on the phone number.
	 *
	 * @param mobileNumber - Mobile Numbers
	 * @param requestInfo  - Request Information
	 * @param tenantId     - Tenant Id
	 * @return Returns List of MobileNumbers and UUIDs
	 */
	public Map<String, String> fetchUserUUIDs(String mobileNumber, RequestInfo requestInfo, String tenantId) {
		Map<String, String> mapOfPhoneNoAndUUIDs = new HashMap<>();
		StringBuilder uri = new StringBuilder();
		uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
		Map<String, Object> userSearchRequest = new HashMap<>();
		userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("tenantId", tenantId);
		userSearchRequest.put("userType", "CITIZEN");
		userSearchRequest.put("userName", mobileNumber);
		try {

			Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
			log.info("User fetched in fetUserUUID method of Ewaste notfication consumer" + user.toString());
//			if (null != user) {
//				String uuid = JsonPath.read(user, "$.user[0].uuid");
			if (user instanceof Optional) {
				Optional<Object> optionalUser = (Optional<Object>) user;
				if (optionalUser.isPresent()) {
					String uuid = JsonPath.read(optionalUser.get(), "$.user[0].uuid");
					mapOfPhoneNoAndUUIDs.put(mobileNumber, uuid);
				}
			} else {
				log.error("Service returned null while fetching user for username - " + mobileNumber);
			}
		} catch (Exception e) {
			log.error("Exception while fetching user for username - " + mobileNumber);
			log.error("Exception trace: ", e);
		}

		return mapOfPhoneNoAndUUIDs;
	}

}
