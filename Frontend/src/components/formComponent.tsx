import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import api from "../services/api.service";
import { taskFormFields } from "../lib/constants";

const formSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  assignee: z.enum(["Sivan", "Shaked", "Elad", "Maya"], {
    required_error: "Assignee is required",
  }),
  dueDate: z.string().min(1, "Due Date is required"),
  status: z.enum(["Not Started", "In Progress", "Completed"], {
    required_error: "Status is required",
  }),
  priority: z.enum(["Low", "Medium", "High"], {
    required_error: "Priority is required",
  }),
  notes: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

function CreateTaskPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      assignee: undefined,
      dueDate: "",
      status: undefined,
      priority: undefined,
      notes: "",
    },
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(values: FormData) {
    try {
      await api.post("/table/createRecord", values);
      form.reset();
      setSuccessMessage("✅ Task created successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      setSuccessMessage("");
      setErrorMessage("Something went wrong. Please try again.");
      console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-md rounded-lg">
      <div className="bg-white p-6 rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Create New Task
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 mt-1">
            Fill out the form to create a task
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <CardContent className="space-y-4">
              {successMessage && (
                <div className="text-green-500 text-sm text-center">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="text-red-500 text-sm text-center">
                  {errorMessage}
                </div>
              )}
              {taskFormFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as keyof FormData}
                  render={({ field: controllerField }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        {field.label}
                      </FormLabel>
                      <FormControl>
                        {field.inputType === "select" && field.options ? (
                          <select
                            {...controllerField}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select...</option>
                            {field.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field.inputType === "textarea" ? (
                          <textarea
                            {...controllerField}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={field.placeholder}
                          />
                        ) : (
                          <Input
                            {...controllerField}
                            type={field.inputType}
                            placeholder={field.placeholder}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 shadow text-white transition-all duration-150"
              >
                Create Task
              </Button>
            </CardFooter>
          </form>
        </Form>
      </div>
    </Card>
  );
}

export default CreateTaskPage;
