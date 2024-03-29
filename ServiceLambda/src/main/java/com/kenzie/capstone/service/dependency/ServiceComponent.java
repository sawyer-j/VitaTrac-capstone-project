package com.kenzie.capstone.service.dependency;

import com.kenzie.capstone.service.ExerciseService;
import com.kenzie.capstone.service.LambdaService;

import com.kenzie.capstone.service.MealService;
import dagger.Component;

import javax.inject.Singleton;

/**
 * Declares the dependency roots that Dagger will provide.
 */
@Singleton
@Component(modules = {DaoModule.class, ServiceModule.class})
public interface ServiceComponent {
    LambdaService provideLambdaService();
    ExerciseService provideExerciseService();
    MealService provideMealService();
}
