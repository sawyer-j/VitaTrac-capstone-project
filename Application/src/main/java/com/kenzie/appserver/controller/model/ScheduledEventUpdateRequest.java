package com.kenzie.appserver.controller.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kenzie.appserver.service.model.EventType;

import javax.validation.constraints.NotEmpty;
import java.time.ZonedDateTime;

public class ScheduledEventUpdateRequest {

    @NotEmpty
    @JsonProperty("eventId")
    private String eventId;

    @NotEmpty
    @JsonProperty("userId")
    private String userId;

    @JsonProperty("mealId")
    private String mealId;

    @JsonProperty("exerciseId")
    private String exerciseId;

    @JsonProperty("eventType")
    private EventType eventType;

    @JsonProperty("scheduledDateTime")
    private ZonedDateTime scheduledDateTime;

    @JsonProperty("completed")
    private boolean completed;

    @JsonProperty("metricsCompleted")
    private boolean metricsCalculated;

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMealId() {
        return mealId;
    }

    public void setMealId(String mealId) {
        this.mealId = mealId;
    }

    public String getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(String exerciseId) {
        this.exerciseId = exerciseId;
    }

    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    public ZonedDateTime getScheduledDateTime() {
        return scheduledDateTime;
    }

    public void setScheduledDateTime(ZonedDateTime scheduledDateTime) {
        this.scheduledDateTime = scheduledDateTime;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public boolean isMetricsCalculated() {
        return metricsCalculated;
    }

    public void setMetricsCalculated(boolean metricsCalculated) {
        this.metricsCalculated = metricsCalculated;
    }
}
