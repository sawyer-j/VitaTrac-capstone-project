package com.kenzie.capstone.service.dependency;

import com.kenzie.capstone.service.ExerciseService;
import com.kenzie.capstone.service.LambdaService;
import com.kenzie.capstone.service.MealService;
import com.kenzie.capstone.service.dao.ExampleDao;

import com.kenzie.capstone.service.dao.ExerciseDao;
import com.kenzie.capstone.service.dao.MealDao;
import dagger.Module;
import dagger.Provides;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;

@Module(
    includes = DaoModule.class
)
public class ServiceModule {

    @Singleton
    @Provides
    @Inject
    public LambdaService provideLambdaService(@Named("ExampleDao") ExampleDao exampleDao) {
        return new LambdaService(exampleDao);
    }
    @Singleton
    @Provides
    @Inject
    public ExerciseService provideExerciseService(@Named("ExerciseDao")ExerciseDao exerciseDao){
        return new ExerciseService(exerciseDao);
    }

    @Singleton
    @Provides
    @Inject
    public MealService provideMealService(@Named("MealDao") MealDao mealDao){
        return new MealService(mealDao);
    }
}

