import BaseClass from "../util/baseClass";
import axios from "axios";

import * as eventData from "./eventdata.js";
import { DateTime } from "luxon";

export default class ApiClient extends BaseClass {
  static baseUrl = "http://127.0.0.1:5001";

  constructor(props = {}) {
    super();
    const methodsToBind = [
      "clientLoaded",
      "createUser",
      "handleError",
      "createPayload",
      "loginUser",
      "getAllSchedules",
      "getOneSchedule",
      "getCurrentSchedule",
      "createSchedule",
      "editSchedule",
      "deleteSchedule",
    ];
    try {
      this.bindClassMethods(methodsToBind, this);
    } catch (error) {
      console.warn(error);
    }
    this.props = props;

    this.clientLoaded(axios);

    const meals = ["Breakfast", "Lunch", "Dinner", "Snack"];
    const exercises = ["Cardio", "Strength", "Flexibility"];

    window.localStorage.setItem(
      "exerciseEvents",
      JSON.stringify(eventData.exerciseData),
    );
    //window.localStorage.setItem("exerciseCardio", JSON.stringify(eventData.exerciseCardio));
    window.localStorage.setItem(
      "exerciseStrength",
      JSON.stringify(eventData.exerciseStrength),
    );
    window.localStorage.setItem(
      "exerciseFlexibility",
      JSON.stringify(eventData.exerciseFlexibility),
    );

    for (const meal of meals) {
      this.getAllMealEvents(meal);
    }
    for (const exercise of exercises) {
      this.getAllExerciseEvents(exercise);
    }
  }

  clientLoaded(client) {
    this.client = client;
    if (this.props.hasOwnProperty("onReady")) {
      this.props.onReady();
    }
  }

  createPayload(formData) {
    return Object.fromEntries(formData.entries());
  }

  async loginUser(data, errorCallback) {
    const payload = data;
    const url = `${ApiClient.baseUrl}/user/login`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      return await this.client.post(url, payload, config);
    } catch (error) {
      this.handleError("loginUser", error, errorCallback);
    }
  }

  async createUser(data, errorCallback) {
    const payload = data;
    const url = `${ApiClient.baseUrl}/user/create`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      let response = await this.client.post(url, payload, config);
      return response.data;
    } catch (error) {
      this.handleError("createUser", error, errorCallback);
    }
  }

  async updateUserMetrics(payload, errorCallback) {
    const url = `${ApiClient.baseUrl}/healthMetrics/update`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await this.client.post(url, payload, config).then((res) => {
        window.localStorage.setItem("metrics", JSON.stringify(res.data));
      });
    } catch (error) {
      this.handleError("updateUserMetrics", error, errorCallback);
    }
  }

  async editUser(data, errorCallback) {
    const payload = data;

    const { userId, weight, weightUnit } = payload;
    const metricUpdatePayload = {
      userId,
      weight,
      weightUnit: weightUnit.toUpperCase(),
    };

    const url = `${ApiClient.baseUrl}/user/${payload.userId}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await this.client
        .put(url, payload, config)
        .then(async (res) => {
          window.sessionStorage.setItem("userInfo", JSON.stringify(res.data));
        })
        .then(async () => {
          await this.updateUserMetrics(metricUpdatePayload);
        });
    } catch (error) {
      this.handleError("editUser", error, errorCallback);
    }
  }

  // Newly Added Schedule API methods
  async getAllSchedules(errorCallback) {
    const url = `${ApiClient.baseUrl}/user-schedule/`;
    try {
      return await this.client.get(url);
    } catch (error) {
      this.handleError("getAllSchedules", error, errorCallback);
    }
  }

  async getOneSchedule(scheduleId, errorCallback) {
    const url = `${ApiClient.baseUrl}/user-schedules/${scheduleId}`;
    try {
      return await this.client.get(url);
    } catch (error) {
      this.handleError("getOneSchedule", error, errorCallback);
    }
  }

  async getCurrentSchedule(userId, errorCallback) {
    const url = `${ApiClient.baseUrl}/user-schedules/current/${userId}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      return await this.client.get(url, config);
    } catch (error) {
      this.handleError("createSchedule", error, errorCallback);
    }
  }

  async editSchedule(scheduleId, data, errorCallback) {
    const payload = data;
    const url = `${ApiClient.baseUrl}/user-schedule/${scheduleId}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      return await this.client.put(url, payload, config);
    } catch (error) {
      this.handleError("editSchedule", error, errorCallback);
    }
  }

  async deleteSchedule(scheduleId, errorCallback) {
    const url = `${ApiClient.baseUrl}/user-schedule/${scheduleId}`;
    try {
      return await this.client.delete(url);
    } catch (error) {
      this.handleError("deleteSchedule", error, errorCallback);
    }
  }

  async createSchedule(userId, currentWeek, errorCallback) {
    const url = `${ApiClient.baseUrl}/user-schedules/`;
    const payload = { userId, ...currentWeek };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      return await this.client.post(url, payload, config);
    } catch (error) {
      this.handleError("createSchedule", error);
    }
  }

  async updateUserInfo(userId, errorCallback) {
    const url = `${ApiClient.baseUrl}/user/${userId}/`;
    try {
      await this.client
        .get(url)
        .then((res) => {
          window.sessionStorage.setItem("userInfo", JSON.stringify(res.data));
        })
        .then((res) => {
          return res;
        });
    } catch (error) {
      this.handleError("updateUserInfo", error, errorCallback);
    }
  }

  async getUserMetrics(userId) {
    const url = `${ApiClient.baseUrl}/healthMetrics/${userId}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await this.client.get(url, config);

      return response.data; // Return the data directly
    } catch (error) {
      console.error("Error in getUserMetrics:", error);
      return null; // Return null or a custom error object
    }
  }

  async getMealEvent(mealId) {
    const url = `${ApiClient.baseUrl}/eventData/meal/id/${mealId}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const data = JSON.parse(window.localStorage.getItem("mealEvents"));

    if (data) {
      for (let meal of data) {
        if (meal.mealId === mealId) {
          return meal;
        }
      }
    }

    if (!data) {
      try {
        const response = await this.client.get(url, config);

        return response.data; // Return the data directly
      } catch (error) {
        console.error("Error in getMealEvent:", error);
        return null; // Return null or a custom error object
      }
    }
  }

  async getExerciseEvent(exerciseId) {
    const url = `${ApiClient.baseUrl}/eventData/exercise/id/${exerciseId}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const data = JSON.parse(window.localStorage.getItem("exerciseEvents"));

    if (data) {
      for (let exercise of data) {
        if (exercise.exerciseId === exerciseId) {
          return exercise;
        }
      }
    }

    if (!data) {
      try {
        const response = await this.client.get(url, config);

        return response.data; // Return the data directly
      } catch (error) {
        console.error("Error in getMealEvent:", error);
        return null; // Return null or a custom error object
      }
    }
  }

  async getAllMealEvents(type) {
    const url = `${ApiClient.baseUrl}/eventData/meal/type/${type}`;

    const data = JSON.parse(window.localStorage.getItem(`meal${type}`));

    if (!data) {
      try {
        await this.client.get(url).then((res) => {
          window.localStorage.setItem(`meal${type}`, JSON.stringify(res.data));
        });
      } catch (error) {
        console.error(" Network Error in getAllMealEvents:", error);
        return error; // Return null or a custom error object
      }
    }

    return data || [];
  }

  async getAllExerciseEvents(type) {
    const url = `${ApiClient.baseUrl}/eventData/exercise/type/${type}`;

    const data = JSON.parse(window.localStorage.getItem(`exercise${type}`));

    if (!data) {
      try {
        await this.client.get(url).then((res) => {
          window.localStorage.setItem(
            `exercise${type}`,
            JSON.stringify(res.data),
          );
        });
      } catch (error) {
        console.error(" Network Error in getAllexerciseEvents:", error);
        return error; // Return null or a custom error object
      }
    }

    return data || [];
  }

  async createScheduleEvent(payload, scheduledListId) {
    const url = `${ApiClient.baseUrl}/events/`;
    console.log({ payload }, scheduledListId);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      console.log({ payload });
      return await this.client
        .post(url, payload, config)
        .then((res) => {
          return {
            response: res.data,
            scheduleId: scheduledListId,
          }
        })

    } catch (error) {
      this.handleError("createScheduleEvent", error, errorCallback);
    }
  }

  /*

@JsonProperty("scheduleId")
  private String scheduleId;
@JsonProperty("start")
  private ZonedDateTime start;
@JsonProperty("end")
  private ZonedDateTime end;
@JsonProperty("scheduledEventIds")
  private List<ScheduledEventUpdateRequest> scheduledEventUpdates;
@JsonProperty("userId")
  private String userId;
   */
  async updateSchedule(scheduledEventItem) {


      const {eventId} = scheduledEventItem.response;
      const scheduleId = JSON.parse(window.localStorage.getItem("scheduleData"));
      const schId = Object.keys(scheduleId)[0];
      const scheduleEventList = Object.values(scheduleId)[schId].scheduledEventIds;

    const url = `${ApiClient.baseUrl}/user-schedule/${schId}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const scheduleData = JSON.parse(
        window.localStorage.getItem("scheduleData"),
      );

      const payload = {
        scheduleId: scheduleId,
        start: scheduledEventItem.scheduledDateTime,
        end: DateTime.fromISO(scheduledEventItem.scheduledDateTime)
          .plus({ hours: 1 })
          .toISO(),
        scheduledEventIds: [eventId],
        userId: scheduledEventItem.userId,
      };

      console.log({payload})
      await this.client.put(url,payload, config);
    } catch (error) {
      console.log(error)
    }
  }

  handleError(method, error, errorCallback) {
    console.error(method + " failed - " + error);
    if (error.response?.data && error.response.data.message !== undefined) {
      console.error(error.response.data.message);
    }
    if (errorCallback) {
      errorCallback(method + " failed - " + error);
    }
  }
}
